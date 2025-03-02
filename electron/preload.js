const { contextBridge, ipcRenderer } = require('electron');

// Expose functions to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  sendOnlineStatus: (status) => ipcRenderer.send('network-status', status),
  addProduct :(product) => ipcRenderer.send('add-product', product),
  receiveMessage: (callback) => ipcRenderer.on('message-from-electron', (event, data) => callback(data))
});
  