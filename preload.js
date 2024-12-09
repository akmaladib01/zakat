const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(event, ...args)),
  once: (channel, callback) => ipcRenderer.once(channel, (event, ...args) => callback(event, ...args)),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});
