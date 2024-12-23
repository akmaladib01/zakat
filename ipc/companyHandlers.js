const { ipcMain } = require('electron');
const db = require('../db/database');

// Register new company
ipcMain.on('register-company', (event, formData) => {
  const stmt = db.prepare(`
    INSERT INTO PAYER (idNumber, name, address1, address2, postcode, city, state, phoneNumber, faxNumber,
    website, sector, muslimStaff, ownershipPercentage, PICName, PICEmail, PICPhoneNumber,
    profileID, identificationID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    // Execute the insertion
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

    // Fetch the last inserted payerID
    const result = db.prepare('SELECT last_insert_rowid() AS payerID').get();
    const payerID = result.payerID;

    event.reply('company-registered', { success: true, payerID });
  } catch (error) {
    event.reply('company-registered', { success: false, error: error.message });
  }
});


// Fetch company
ipcMain.on('fetch-company', (event, { searchValue, profileID, isSearchByName }) => {
  const stmt = db.prepare(`
    SELECT payerID, idNumber, name, sector, identificationID, address1, address2, postcode, city, state, phoneNumber,
    faxNumber, website, muslimStaff, ownershipPercentage, PICName, PICEmail, PICPhoneNumber, profileID
    FROM PAYER
    WHERE profileID = ? AND ${isSearchByName ? 'name LIKE ?' : 'idNumber = ?'}
  `);

  const adjustedValue = isSearchByName ? `%${searchValue}%` : searchValue;
  const result = stmt.get(profileID, adjustedValue);
  event.reply(result ? 'company-fetched' : 'company-not-found', result);
});

// Update company
ipcMain.on('update-company', (event, formData) => {
  const stmt = db.prepare(`
    UPDATE PAYER
    SET name = ?, identificationID = ?, address1 = ?, address2 = ?, postcode = ?, city = ?, state = ?, phoneNumber = ?,
    sector = ?, faxNumber = ?, website = ?, muslimStaff = ?, ownershipPercentage = ?, PICName = ?, PICEmail = ?, PICPhoneNumber = ?
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
      formData.sector,
      formData.faxNumber,
      formData.website,
      formData.muslimStaff,
      formData.ownershipPercentage,
      formData.PICName,
      formData.PICEmail,
      formData.PICPhoneNumber,
      formData.idNumber,
      formData.profileID
    );
    event.reply('company-updated', { success: true });
  } catch (error) {
    event.reply('company-updated', { success: false, error: error.message });
  }
});
