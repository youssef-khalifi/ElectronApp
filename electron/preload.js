const { contextBridge, ipcRenderer } = require('electron');

// Expose functions to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  sendOnlineStatus: (status) => ipcRenderer.send('network-status', status),
  addProduct: (product) => ipcRenderer.invoke('addPro', product),
  getProduct: (productId) => ipcRenderer.invoke('get-product', productId),
  getAllProducts: () => ipcRenderer.invoke('get-all-products'),
  receiveMessage: (callback) => ipcRenderer.on('message-from-electron', (event, data) => callback(data))
});
  