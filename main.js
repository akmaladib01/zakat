const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { autoUpdater } = require('electron-updater');


// Define database path in the userData directory
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'data_zakat.db');

// Fallback SQL Schema
const fallbackSchema = `
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "CODE" (
	"codeID"	INTEGER,
	"codeType"	TEXT NOT NULL,
	"codeValue"	TEXT NOT NULL,
	PRIMARY KEY("codeID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "IDENTIFICATION" (
	"identificationID"	INTEGER,
	"identificationName"	TEXT NOT NULL,
	PRIMARY KEY("identificationID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "PAYER" (
	"payerID"	INTEGER,
	"idNumber"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"address1"	TEXT,
	"address2"	TEXT,
	"postcode"	TEXT,
	"city"	TEXT,
	"state"	TEXT,
	"phoneNumber"	TEXT,
	"email"	TEXT,
	"sector"	TEXT,
	"muslimStaff"	INTEGER,
	"ownershipPercentage"	REAL,
	"PICName"	TEXT,
	"PICEmail"	TEXT,
	"PICPhoneNumber"	TEXT,
	"profileID"	INTEGER,
	"identificationID"	INTEGER,
	PRIMARY KEY("payerID" AUTOINCREMENT),
	FOREIGN KEY("profileID") REFERENCES "PROFILE"("profile_id")
);
CREATE TABLE IF NOT EXISTS "PROFILE" (
	"profile_id"	INTEGER,
	"profile_type"	TEXT,
	PRIMARY KEY("profile_id")
);
CREATE TABLE IF NOT EXISTS "SPG" (
	"spgID"	INTEGER,
	"HeaderID"	TEXT NOT NULL,
	"noCheque"	TEXT NOT NULL,
	"bulanTahun"	TEXT NOT NULL,
	"Amaun"	REAL NOT NULL,
	"isSynced"	INTEGER DEFAULT 0,
	"bankID"	INTEGER,
	"MOPID"	INTEGER,
	"payerID"	INTEGER,
	PRIMARY KEY("spgID" AUTOINCREMENT),
	FOREIGN KEY("payerID") REFERENCES "PAYER"("payerID")
);
CREATE TABLE IF NOT EXISTS "TRANSACTIONS" (
	"transactionID"	INTEGER,
	"date"	TEXT NOT NULL,
	"time"	TEXT NOT NULL,
	"totalAmount"	REAL NOT NULL,
	"chequeNo"	TEXT,
	"referenceNo"	TEXT,
	"isSynced"	INTEGER DEFAULT 0,
	"payerID"	INTEGER,
	"MOPID"	INTEGER,
	"bankID"	INTEGER,
	PRIMARY KEY("transactionID" AUTOINCREMENT),
	FOREIGN KEY("payerID") REFERENCES "PAYER"("payerID")
);
INSERT INTO "PROFILE" VALUES (1,'individu');
INSERT INTO "PROFILE" VALUES (2,'company');
COMMIT;
`;

// Ensure the database exists in the userData directory
let db;
if (!fs.existsSync(dbPath)) {
  console.log('Database not found. Initializing with fallback schema.');

  db = new Database(dbPath);
  db.exec(fallbackSchema); // Execute the SQL schema to initialize the database
  console.log('Database created successfully with fallback schema.');
} else {
  // Initialize existing database
  db = new Database(dbPath, { verbose: console.log });
  console.log('Existing database loaded.');
}

// Enable foreign key support
db.pragma('foreign_keys = ON');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1250,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true, // Ensure this is properly configured
    },
  });

  mainWindow.loadURL(`file://${__dirname}/dist/zakat/browser/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Wait until Electron is ready before checking for updates
app.on('ready', () => {
  createWindow();

  // Check for updates and notify
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. It will be downloaded in the background.'
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Restart', 'Later'],
      defaultId: 0,
      message: 'Update downloaded. Restart the app to apply updates?'
    }).then((response) => {
      if (response.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (err) => {
    dialog.showErrorBox('Update Error', err == null ? 'unknown' : (err.stack || err).toString());
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// Search user/company
ipcMain.on('search-user', (event, { profileID, searchValue, searchField }) => {
  let stmt;
  
  // search by idNumber
  if (searchField === 'idNumber') {
    stmt = db.prepare(`
      SELECT PAYER.*, PROFILE.profile_type FROM PAYER
      LEFT JOIN PROFILE ON PAYER.profileID = PROFILE.profile_id
      WHERE PAYER.profileID = ? AND PAYER.idNumber = ?
    `);
  // search by name
  } else if (searchField === 'name') {
    stmt = db.prepare(`
      SELECT PAYER.*, PROFILE.profile_type FROM PAYER
      LEFT JOIN PROFILE ON PAYER.profileID = PROFILE.profile_id
      WHERE PAYER.profileID = ? AND PAYER.name LIKE ?
    `);
    searchValue = `%${searchValue}%`;
  }

  const result = stmt.get(profileID, searchValue);
  
  if (result) {
    event.reply('user-found', result);
  } else {
    event.reply('user-not-found');
  }
});

// register new user
ipcMain.on('register-payer', (event, formData) => {
  const stmt = db.prepare(`
    INSERT INTO PAYER (idNumber, name, identificationID, address1, address2, postcode, city, state, phoneNumber, email, profileID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    stmt.run(
      formData.idNumber,
      formData.name,
      formData.identificationID,
      formData.address1,
      formData.address2,
      formData.postcode,
      formData.city,
      formData.state,
      formData.phoneNumber,
      formData.email,
      formData.profileID
    );
    event.reply('payer-registered', { success: true });
  } catch (error) {
    event.reply('payer-registered', { success: false, error: error.message });
  }
});

// register new company
ipcMain.on('register-company', (event, formData) => {
  const stmt = db.prepare(`
    INSERT INTO PAYER (idNumber, name, address1, address2, postcode, city, state, phoneNumber, faxNumber,
    website, sector, muslimStaff, ownershipPercentage, PICName, PICEmail, PICPhoneNumber,
    profileID, identificationID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    stmt.run(
      formData.idNumber,
      formData.name,
      formData.address1,
      formData.address2,
      formData.postcode,
      formData.city,
      formData.state,
      formData.phoneNumber,
      formData.faxNumber,
      formData.website,
      formData.sector,
      formData.muslimStaff,
      formData.ownershipPercentage,
      formData.PICName,
      formData.PICEmail,
      formData.PICPhoneNumber,
      formData.profileID,
      formData.identificationID
    );    
    event.reply('company-registered', { success: true });
  } catch (error) {
    event.reply('company-registered', { success: false, error: error.message });
  }
});

// fetch payer
ipcMain.on('fetch-payer', (event, { searchValue, profileID, isSearchByName }) => {
  const stmt = db.prepare(`
    SELECT idNumber, name, identificationID, address1, address2, postcode, city, state, phoneNumber, email, profileID
    FROM PAYER
    WHERE profileID = ? AND ${isSearchByName ? 'name LIKE ?' : 'idNumber = ?'}
  `);

  const adjustedValue = isSearchByName ? `%${searchValue}%` : searchValue;

  const result = stmt.get(profileID, adjustedValue);
  if (result) {
    event.reply('payer-fetched', result);
  } else {
    event.reply('payer-not-found');
  }
});

// fetch company
ipcMain.on('fetch-company', (event, { searchValue, profileID, isSearchByName }) => {
  const stmt = db.prepare(`
    SELECT idNumber, name, sector, identificationID, address1, address2, postcode, city, state, phoneNumber,
    faxNumber, website, muslimStaff, ownershipPercentage, PICName, PICEmail, PICPhoneNumber, profileID
    FROM PAYER
    WHERE profileID = ? AND ${isSearchByName ? 'name LIKE ?' : 'idNumber = ?'}
  `);

  const adjustedValue = isSearchByName ? `%${searchValue}%` : searchValue;

  const result = stmt.get(profileID, adjustedValue);
  if (result) {
    event.reply('company-fetched', result);
  } else {
    event.reply('company-not-found');
  }
});

// update payer
ipcMain.on('update-payer', (event, formData) => {
  const stmt = db.prepare(`
    UPDATE PAYER
    SET name = ?, identificationID = ?, address1 = ?, address2 = ?, postcode = ?, city = ?, state = ?, phoneNumber = ?, email = ?
    WHERE idNumber = ? AND profileID = ?
  `);

  try {
    stmt.run(
      formData.name,
      formData.identificationID,
      formData.address1,
      formData.address2,
      formData.postcode,
      formData.city,
      formData.state,
      formData.phoneNumber,
      formData.email,
      formData.idNumber,
      formData.profileID
    );
    event.reply('payer-updated', { success: true });
  } catch (error) {
    event.reply('payer-updated', { success: false, error: error.message });
  }
});

// update company
ipcMain.on('update-company', (event, formData) => {
  const stmt = db.prepare(`
    UPDATE PAYER
    SET name = ?, identificationID = ?, address1 = ?, address2 = ?, postcode = ?, city = ?, state = ?, phoneNumber = ?,
    sector = ?, faxNumber = ?, website = ?, muslimStaff = ?, ownershipPercentage = ?, PICName = ?, PICEmail = ?, PICPhoneNumber = ?
    WHERE idNumber = ? AND profileID = ?
  `);

  try {
    stmt.run(
      formData.idNumber,
      formData.name,
      formData.sector,
      formData.identificationID,
      formData.address1,
      formData.address2,
      formData.postcode,
      formData.city,
      formData.state,
      formData.phoneNumber,
      formData.faxNumber,
      formData.website,
      formData.muslimStaff,
      formData.ownershipPercentage,
      formData.PICName,
      formData.PICEmail,
      formData.PICPhoneNumber,
      formData.profileID
    );
    event.reply('company-updated', { success: true });
  } catch (error) {
    event.reply('company-updated', { success: false, error: error.message });
  }
});