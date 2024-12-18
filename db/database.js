const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const userDataPath = require('electron').app.getPath('userData');
const dbPath = path.join(userDataPath, 'data_zakat.db');
const schemaPath = path.join(__dirname, 'schema.sql');

let db;

// Initialize the database
function initializeDatabase() {
  if (!fs.existsSync(dbPath)) {
    console.log('Database not found. Initializing with schema...');
    db = new Database(dbPath);
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    console.log('Database created successfully.');
  } else {
    db = new Database(dbPath, { verbose: console.log });
    console.log('Existing database loaded.');
  }

  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  return db;
}

module.exports = initializeDatabase();
