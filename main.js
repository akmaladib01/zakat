const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

require('./db/database'); // Initialize database
require('./ipc/userHandlers'); // Load IPC Handlers
require('./ipc/companyHandlers'); // Load IPC Handlers

// Setup electron-log
log.transports.file.level = 'info'; // Log level set to 'info'
autoUpdater.logger = log; // Assign logger to autoUpdater

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1250,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/dist/zakat/browser/index.html`);
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  createWindow();

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'akmaladib01',
    repo: 'zakat',
    // token: '<your_github_token>',  // Use if your repo is private, else omit it
  });
  

  // Log app readiness
  log.info('App is ready and window created.');

  // Check for updates and log the process
  autoUpdater.checkForUpdatesAndNotify();
  log.info('Checking for updates...');

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info(`Update available: Version ${info.version}`);
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. It will be downloaded in the background.',
    });
  });

  autoUpdater.on('update-not-available', () => {
    log.info('No update available.');
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info(`Update downloaded: Version ${info.version}`);
    dialog
      .showMessageBox({
        type: 'question',
        buttons: ['Restart', 'Later'],
        defaultId: 0,
        message: 'Update downloaded. Restart the app to apply updates?',
      })
      .then((response) => {
        if (response.response === 0) {
          log.info('Restarting to install update...');
          autoUpdater.quitAndInstall();
        }
      });
  });

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err == null ? 'unknown' : (err.stack || err).toString());
    dialog.showErrorBox('Update Error', err == null ? 'unknown' : (err.stack || err).toString());
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
