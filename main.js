const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

// Initialize the SQLite database
const db = new Database('data_zakat.db', { verbose: console.log });
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
      contextIsolation: true, // Ensure that this is set to false if you want access to Node.js in the renderer
    },
  });

  mainWindow.loadURL(`file://${__dirname}/dist/zakat/browser/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

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