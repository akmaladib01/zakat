const { ipcMain } = require('electron');
const db = require('../db/database');
const os = require('os'); // Import os module to fetch system hostname and IP address
const networkInterfaces = os.networkInterfaces();

ipcMain.on('login', (event, loginData) => {
  const { email, password } = loginData;

  // Check if email domain is correct
  if (!email.endsWith('@zakat.com')) {
    event.reply('login-response', { success: false, message: 'Invalid email domain' });
    return;
  }

  // Fetch the user from the database
  const stmt = db.prepare('SELECT * FROM USER WHERE domainEmail = ?');
  const user = stmt.get(email);

  if (user) {
    // Directly compare passwords (no hashing)
    if (user.password === password) {
      // Password is correct, create a session record
      const sessionStmt = db.prepare(`
        INSERT INTO SESSION (hostname, ip_address, date, clock_in, sessionStat, userID)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      // Get the hostname of the device
      const hostname = os.hostname();
      const ipAddress = '127.0.0.1';

      // Get current time (HH:MM:SS)
      const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });  // Format as HH:MM:SS

      // Current date (YYYY-MM-DD)
      const currentDate = new Date().toISOString().split('T')[0];

      // Session status
      const sessionStat = 'active';

      try {
        sessionStmt.run(hostname, ipAddress, currentDate, currentTime, sessionStat, user.userID);
        event.reply('login-response', { success: true, message: 'Login successful', userID: user.userID });
      } catch (error) {
        event.reply('login-response', { success: false, message: 'Error creating session' });
      }
    } else {
      event.reply('login-response', { success: false, message: 'Incorrect password' });
    }
  } else {
    event.reply('login-response', { success: false, message: 'User not found' });
  }
});

