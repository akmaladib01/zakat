const { ipcMain } = require('electron');
const db = require('../db/database');

ipcMain.handle('registerPayment', (event, paymentData) => {
    try {
      const query = `
        INSERT INTO SPG (HeaderID, noCheque, bulanTahun, Amaun, bankID, MOPID, payerID)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const stmt = db.prepare(query);
      stmt.run(paymentData.HeaderID, paymentData.noCheque, paymentData.bulanTahun, paymentData.Amaun, paymentData.bankID, paymentData.MOPID, paymentData.payerID);
      return true; // Return success
    } catch (err) {
      console.error('Database error:', err);
      throw err; // Throw error to be handled outside
    }
  });

