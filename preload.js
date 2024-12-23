const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  queryDatabase: (sql, params) => ipcRenderer.invoke('query-database', sql, params),
  insertDatabase: (sql, params) => ipcRenderer.invoke('insert-database', sql, params),
  registerCompany: (company) => ipcRenderer.invoke("registerCompany", company),
  searchCompany: (name, regNumber) => ipcRenderer.invoke("searchCompany", name, regNumber),
  submitPayment: (payment) => ipcRenderer.invoke("submitPayment", payment),
  generateReceipt: (spgID) => ipcRenderer.invoke("generateReceipt", spgID),
  updateCompany: (company) => ipcRenderer.invoke("updateCompany", company),
  getCompanyById: async (idNumber) => {
    return await ipcRenderer.invoke('getCompanyById', idNumber);
  },
  registerPayment: (paymentData) => ipcRenderer.invoke('registerPayment', paymentData),
  updatePayer: (companyData) => ipcRenderer.invoke('updatePayer', companyData),
  getCompanyByPayerID: (payerID) => ipcRenderer.invoke('getCompanyByPayerID', payerID),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  onUpdateNotAvailable: (callback) => {
    console.log('update-not-available event received in preload.js');
    ipcRenderer.on('update-not-available', callback);
  },
  onUpdateError: (callback) => ipcRenderer.on('update-error', callback),
  restartApp: () => ipcRenderer.send('restart-app'),
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(event, ...args)),
  once: (channel, callback) => ipcRenderer.once(channel, (event, ...args) => callback(event, ...args)),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

window.addEventListener("DOMContentLoaded", () => {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      ipcRenderer.send("toggle-fullscreen");
    });
  }
});

window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled Rejection:', event.reason);
});
