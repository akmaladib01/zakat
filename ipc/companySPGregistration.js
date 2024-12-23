const { ipcMain } = require('electron');
const db = require('../db/database');


ipcMain.handle('getCompanyByPayerID', (event, payerID) => {
    try {
      // Ensure payerID is an integer
      const parsedPayerID = parseInt(payerID, 10);
      if (isNaN(parsedPayerID)) {
        throw new Error('Invalid payerID: Not a number');
      }
      console.log('Payer ID received (as integer):', parsedPayerID);
  
      // Define the query
      const query = `SELECT * FROM PAYER WHERE payerID = ?`;
      console.log('Executing Query:', query, 'with payerID:', parsedPayerID);
  
      // Execute the query using better-sqlite3
      const stmt = db.prepare(query);
      const companyDetails = stmt.get(parsedPayerID); // Use stmt.get() to get the first matching row
  
      // Log the query result
      console.log('Fetched Company Details:', companyDetails);
  
      if (!companyDetails) {
        console.warn(`No company found for payerID: ${parsedPayerID}`);
        return null;
      }
  
      return companyDetails;
    } catch (error) {
      console.error('Error fetching company details:', error.message);
      return null;
    }
  });

  ipcMain.handle('updatePayer', (event, companyData) => {
    try {
      // Define the update query
      const query = `
        UPDATE PAYER
        SET
          idNumber = ?,
          name = ?,
          address1 = ?,
          address2 = ?,
          postcode = ?,
          city = ?,
          state = ?,
          phoneNumber = ?,
          email = ?,
          sector = ?,
          faxnumber = ?,
          website = ?,
          muslimStaff = ?,
          ownershipPercentage = ?,
          PICName = ?,
          PICEmail = ?,
          PICPhoneNumber = ?,
          profileID = ?,
          identificationID = ?,
          syncStat = ?
        WHERE payerID = ?
      `;
  
      // Log the query and parameters
      console.log('Executing query:', query);
      console.log('Parameters:', [
        companyData.idNumber,
        companyData.name,
        companyData.address1,
        companyData.address2,
        companyData.postcode,
        companyData.city,
        companyData.state,
        companyData.phoneNumber,
        companyData.email,
        companyData.sector,
        companyData.faxnumber,
        companyData.website,
        companyData.muslimStaff,
        companyData.ownershipPercentage,
        companyData.PICName,
        companyData.PICEmail,
        companyData.PICPhoneNumber,
        companyData.profileID,
        companyData.identificationID,
        companyData.syncStat,
        companyData.payerID
      ]);
  
      // Prepare the query
      const stmt = db.prepare(query);
  
      // Execute the update query
      const result = stmt.run(
        companyData.idNumber,
        companyData.name,
        companyData.address1,
        companyData.address2,
        companyData.postcode,
        companyData.city,
        companyData.state,
        companyData.phoneNumber,
        companyData.email,
        companyData.sector,
        companyData.faxnumber,
        companyData.website,
        companyData.muslimStaff,
        companyData.ownershipPercentage,
        companyData.PICName,
        companyData.PICEmail,
        companyData.PICPhoneNumber,
        companyData.profileID,
        companyData.identificationID,
        companyData.syncStat,
        companyData.payerID
      );
  
      // Check if rows were affected
      if (result.changes === 0) {
        console.warn('No rows were updated. Check WHERE clause conditions.');
        return false;
      } else {
        console.log('Rows updated:', result.changes);
        return true;
      }
    } catch (error) {
      console.error('Error during update:', error.message);
      return false;
    }
  });

  ipcMain.handle('registerCompany', (event, companyData) => {
    try {
      // Define the insert query
      const sql = `
        INSERT INTO PAYER 
        (idNumber, name, address1, address2, postcode, city, state, phoneNumber, email, sector,
         faxnumber, website, muslimStaff, ownershipPercentage, PICName, PICEmail, PICPhoneNumber,
        profileID, identificationID, syncStat)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      // Prepare the statement
      const stmt = db.prepare(sql);
  
      // Execute the insert query
      const result = stmt.run(
        companyData.idNumber,
        companyData.name,
        companyData.address1,
        companyData.address2,
        companyData.postcode,
        companyData.city,
        companyData.state,
        companyData.phoneNumber,
        companyData.email,
        companyData.sector,
        companyData.faxnumber,
        companyData.website,
        companyData.muslimStaff,
        companyData.ownershipPercentage,
        companyData.PICName,
        companyData.PICEmail,
        companyData.PICPhoneNumber,
        companyData.profileID,
        companyData.identificationID,
        companyData.syncStat
      );
  
      // Return success with the payerID (last inserted ID)
      return { success: true, payerID: result.lastInsertRowid };
    } catch (error) {
      console.error('Error during registration:', error.message);
      return { success: false, error: error.message };
    }
  });