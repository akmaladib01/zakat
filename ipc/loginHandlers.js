const { ipcMain } = require('electron');
const db = require('../db/database');
const axios = require('axios'); // Import axios for HTTP requests

ipcMain.on('login', async (event, loginData) => {
  const { email } = loginData;

  // Check if the email exists in the database
  const userStmt = db.prepare('SELECT * FROM USER WHERE domainEmail = ?');
  const user = userStmt.get(email);

  if (user) {
    // User exists, proceed with session creation
    const sessionStmt = db.prepare(`
      INSERT INTO SESSION (hostname, ip_address, date, clock_in, sessionStat, userID)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    let hostname = '';
    let ipAddress = '';

    try {
      const response = await axios.get('http://localhost:5421/');
      if (response.data) {
        hostname = response.data.localData.hostName || hostname;
        ipAddress = response.data.localData.ipAddress || ipAddress;
      }
    } catch (error) {
      console.error('Error fetching hostname and IP address from localhost:', error);
    }

    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const currentDate = new Date().toISOString().split('T')[0];
    const sessionStat = 'active';

    try {
      sessionStmt.run(hostname, ipAddress, currentDate, currentTime, sessionStat, user.userID);
      event.reply('login-response', { success: true, message: 'Login successful', userID: user.userID });
    } catch (error) {
      console.error('Error creating session:', error);
      event.reply('login-response', { success: false, message: 'Error creating session' });
    }
  } else {
    event.reply('login-response', {
      success: false,
      message: 'User not found. Please provide your full name and phone number to register.',
      requiresRegistration: true,
    });
  }
});

ipcMain.on('register', (event, registerData) => {
  const { email, fullName, phoneNumber } = registerData;

  const registerStmt = db.prepare(`
    INSERT INTO USER (domainEmail, fullName, phone_number)
    VALUES (?, ?, ?)
  `);

  try {
    const result = registerStmt.run(email, fullName, phoneNumber);
    if (result.changes > 0) {
      event.reply('register-response', { success: true, message: 'Registration successful. Please log in.' });
    } else {
      event.reply('register-response', { success: false, message: 'Registration failed.' });
    }
  } catch (error) {
    console.error('Error registering new user:', error);
    event.reply('register-response', { success: false, message: 'Error registering new user.' });
  }
});

