const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
require('./db/database'); // Initialize database
require('./ipc/userHandlers'); // Load IPC Handlers
require('./ipc/companyHandlers'); // Load IPC Handlers

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

  // Check for updates and notify
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. It will be downloaded in the background.'
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Restart', 'Later'],
      defaultId: 0,
      message: 'Update downloaded. Restart the app to apply updates?'
    }).then((response) => {
      if (response.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (err) => {
    dialog.showErrorBox('Update Error', err == null ? 'unknown' : (err.stack || err).toString());
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});