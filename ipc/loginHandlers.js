const { ipcMain } = require('electron');
const db = require('../db/database');
const axios = require('axios'); // Import axios for HTTP requests

ipcMain.on('login', async (event, loginData) => {
  const { email, password } = loginData;

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

      let hostname = '';
      let ipAddress = ''; // Default values

      try {
        // Fetch hostname and IP address from localhost server
        const response = await axios.get('http://localhost:5421/');
        if (response.data) {
          hostname = response.data.localData.hostName || hostname;
          ipAddress = response.data.localData.ipAddress || ipAddress;
        }
      } catch (error) {
        console.error('Error fetching hostname and IP address from localhost:', error);
      }

      // Get current time (HH:MM:SS)
      const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false }); // Format as HH:MM:SS

      // Current date (YYYY-MM-DD)
      const currentDate = new Date().toISOString().split('T')[0];

      // Session status
      const sessionStat = 'active';

      try {
        sessionStmt.run(hostname, ipAddress, currentDate, currentTime, sessionStat, user.userID);
        event.reply('login-response', { success: true, message: 'Login successful', userID: user.userID });
      } catch (error) {
        console.error('Error creating session:', error);
        event.reply('login-response', { success: false, message: 'Error creating session' });
      }
    } else {
      event.reply('login-response', { success: false, message: 'Incorrect password' });
    }
  } else {
    event.reply('login-response', { success: false, message: 'User not found' });
  }
});
