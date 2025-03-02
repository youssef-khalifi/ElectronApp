// Modules to control application life and create native browser window
const { app, BrowserWindow , ipcMain} = require('electron')
const path = require('node:path')
const sqlite3 = require('sqlite3').verbose(); // or 'better-sqlite3'

// Database
// Create and open the SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err);
  } else {
    console.log('SQLite database opened successfully');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL
  );
`, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Products table ensured.');
  }
});

ipcMain.handle('get-all-products', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) {
        console.error('Error fetching all products:', err);
        reject('Error fetching all products');
      } else {
        console.log('Fetched products:', rows);
        resolve(rows); // Return all products as an array
      }
    });
  });
});


// Expose the database functions to the renderer process (Angular)
ipcMain.handle('get-product', async (event, productId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
      if (err) {
        reject('Error fetching product data');
      } else {
        resolve(row);
      }
    });
  });
});

ipcMain.handle('addPro', async (event, product) => {
  return new Promise((resolve, reject) => {
    const { name,description, price } = product;
    db.run('INSERT INTO products (name,description, price) VALUES (?,?, ?)', [name,description, price], function (err) {
      if (err) {
        reject('Error adding product');
      } else {
        resolve({ id: this.lastID, name,description, price });
      }
    });
  });
});



function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${path.join(__dirname, '../dist/online-status/browser/index.html')}`)
    console.log("Angular App Loaded in Electron");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// Listen for messages from Angular (Renderer process)
ipcMain.on('add-product', (event, message) => {
  console.log('Received from Angular:', message);
});