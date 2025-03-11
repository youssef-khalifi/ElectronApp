const { contextBridge, ipcRenderer } = require('electron');

// Expose functions to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {

  sendOnlineStatus: (status) => ipcRenderer.send('network-status', status),

  addProduct: (product) => ipcRenderer.invoke('addPro', product),

  getProduct: (productId) => ipcRenderer.invoke('get-product', productId),

  getAllProducts: () => ipcRenderer.invoke('get-all-products'),

  deleteProduct: (productId) => ipcRenderer.invoke('deletePro', productId),

  getUnSyncProducts: () => ipcRenderer.invoke('getUnSyncProducts'),

  markProductsAsSynced: (products) => ipcRenderer.invoke('markProductsAsSynced' ),

  receiveMessage: (callback) => ipcRenderer.on('message-from-electron', (event, data) => callback(data))
});
