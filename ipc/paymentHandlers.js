const { ipcMain } = require('electron');
const db = require('../db/database');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const userDataPath = app.getPath('userData');
const counterFilePath = path.join(userDataPath, 'counter.json');

// Initialize the counter
function initializeCounter() {
  if (!fs.existsSync(counterFilePath)) {
    const initialCounter = { counter: 0 };
    fs.writeFileSync(counterFilePath, JSON.stringify(initialCounter));
    console.log('Counter file created with initial value.');
  }
}

module.exports = { initializeCounter };

// Retrieve the current counter from the file
function getCurrentCounter() {
  const counterData = JSON.parse(fs.readFileSync(counterFilePath, 'utf8'));
  return counterData.counter || 0;
}

// Save the updated counter to the file
function updateCounter(newCounter) {
  const counterData = { counter: newCounter };
  fs.writeFileSync(counterFilePath, JSON.stringify(counterData));
}

// Generate the reference number based on the counter
ipcMain.on('generate-reference', (event) => {
  const currentCounter = getCurrentCounter();
  const newCounter = currentCounter + 1;
  
  // Update the counter file with the new counter
  updateCounter(newCounter);

  // Get current time (hour and minute)
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  // Format reference number
  const referenceNo = `CZO${hour}${minute}${String(newCounter).padStart(3, '0')}`;

  event.reply('generated-reference', referenceNo);
});

// Save transaction
ipcMain.on('save-transaction', (event, transactionData) => {
  const stmt = db.prepare(`
    INSERT INTO TRANSACTIONS 
    (date, time, totalAmount, chequeNo, referenceNo, isSynced, payerID, MOP, bankID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      transactionData.date,
      transactionData.time,
      transactionData.totalAmount,
      transactionData.chequeNo || null,
      transactionData.referenceNo,
      0, // Default isSynced to 0
      transactionData.payerID,
      transactionData.MOP,
      transactionData.bankID || null
    );
    event.reply('transaction-saved', { success: true, transactionID: result.lastInsertRowid });
  } catch (error) {
    event.reply('transaction-saved', { success: false, error: error.message });
  }
});

// Save zakat details
ipcMain.on('save-transaction-zakat', (event, { transactionID, zakatDetails }) => {
    const stmt = db.prepare(`
      INSERT INTO TRANSACTION_ZAKAT (zakatID, amount, transactionID)
      VALUES (?, ?, ?)
    `);
  
    try {
      const dbTransaction = db.transaction((details) => {
        details.forEach((zakat) => {
          stmt.run(zakat.zakatID, zakat.amount, transactionID);
        });
      });
  
      dbTransaction(zakatDetails);
      event.reply('zakat-details-saved', { success: true });
    } catch (error) {
      event.reply('zakat-details-saved', { success: false, error: error.message });
    }
  });
  