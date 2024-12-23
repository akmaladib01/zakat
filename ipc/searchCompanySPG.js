const { ipcMain } = require('electron');
const db = require('../db/database');

 // Search-company using better-sqlite3
ipcMain.handle('searchCompany', async (event, name, regNumber) => {
    let sql;
    let params;
  
    // If registration number is provided, search for exact match; otherwise, search by name
    if (regNumber) {
      sql = `SELECT * FROM PAYER WHERE idNumber = ?`;
      params = [regNumber];
    } else {
      sql = `SELECT * FROM PAYER WHERE LOWER(name) LIKE LOWER(CONCAT('%', ?, '%'))`;
      params = [name];
    }
  
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all(...params); // Execute the query and get all matching rows
      return rows; // Return the rows (companies)
    } catch (err) {
      console.error(err);
      throw new Error(err.message); // Throw error if there is an issue with the query
    }
  });