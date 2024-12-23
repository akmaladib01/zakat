const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { initializeCounter } = require('./ipc/paymentHandlers');

require('./db/database'); 
require('./ipc/userHandlers');
require('./ipc/companyHandlers');
require('./ipc/paymentHandlers');
require('./ipc/loginHandlers');
require('./ipc/searchCompanySPG');
require('./ipc/companySPGregistration');
require('./ipc/companySPGpayment');


let mainWindow;

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1250,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  const startURL = app.isPackaged
    ? `file://${path.join(__dirname, 'dist/zakat/browser/index.html')}` // For packaged app
    : `file://${path.join(__dirname, 'dist/zakat/browser/index.html')}`; // Development mode

  console.log('Loading URL:', startURL);
  
  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle Auto-Updater Events
function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info(`Update available: Version ${info.version}`);
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: 'A new update is available. It will be downloaded in the background.',
    });
  });

  autoUpdater.on('update-not-available', () => {
    log.info('No updates available.');
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info(`Update downloaded: Version ${info.version}`);
    dialog
      .showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['Restart', 'Later'],
        defaultId: 0,
        title: 'Update Ready',
        message: 'Update downloaded. Would you like to restart the app now?',
      })
      .then((response) => {
        if (response.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err);
  });

  autoUpdater.checkForUpdatesAndNotify();
}

app.on('ready', () => {
  createWindow();
  setupAutoUpdater();
  initializeCounter();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
