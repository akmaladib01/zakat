const { ipcMain } = require('electron');
const db = require('../db/database');

// Search user/company
ipcMain.on('search-user', (event, { profileID, searchValue, searchField }) => {
  let stmt;
  
  if (searchField === 'idNumber') {
    stmt = db.prepare(`
      SELECT PAYER.*, PROFILE.profile_type FROM PAYER
      LEFT JOIN PROFILE ON PAYER.profileID = PROFILE.profile_id
      WHERE PAYER.profileID = ? AND PAYER.idNumber = ?
    `);
  } else if (searchField === 'name') {
    stmt = db.prepare(`
      SELECT PAYER.*, PROFILE.profile_type FROM PAYER
      LEFT JOIN PROFILE ON PAYER.profileID = PROFILE.profile_id
      WHERE PAYER.profileID = ? AND PAYER.name LIKE ?
    `);
    searchValue = `%${searchValue}%`;
  }

  const result = stmt.get(profileID, searchValue);
  event.reply(result ? 'user-found' : 'user-not-found', result);
});

// Register new user
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

// Fetch user
ipcMain.on('fetch-payer', (event, { searchValue, profileID, isSearchByName }) => {
  const stmt = db.prepare(`
    SELECT payerID, idNumber, name, identificationID, address1, address2, postcode, city, state, phoneNumber, email, profileID
    FROM PAYER
    WHERE profileID = ? AND ${isSearchByName ? 'name LIKE ?' : 'idNumber = ?'}
  `);

  const adjustedValue = isSearchByName ? `%${searchValue}%` : searchValue;
  const result = stmt.get(profileID, adjustedValue);
  event.reply(result ? 'payer-fetched' : 'payer-not-found', result);
});

// Update user
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
