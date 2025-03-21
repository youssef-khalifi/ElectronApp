// Modules to control application life and create native browser window
const { app, BrowserWindow , ipcMain} = require('electron')
const path = require('node:path')
const sqlite3 = require('sqlite3').verbose(); // or 'better-sqlite3'

// Database
// Create and open the SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'data.db'), (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err);
  } else {
    console.log('SQLite database opened successfully');
  }
});

//create product table
db.run(`
  CREATE TABLE IF NOT EXISTS products (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL,
   description TEXT,
   price REAL NOT NULL,
   created_at TEXT NOT NULL DEFAULT (datetime('now')),
   updated_at TEXT,
   is_deleted INTEGER NOT NULL DEFAULT 0,
   is_synced INTEGER NOT NULL DEFAULT 0,
   last_synced_at TEXT,
   sync_id TEXT NOT NULL DEFAULT (lower(hex(randomblob(16))))
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
        // Transform boolean fields (convert 0 → false, 1 → true)
        const transformedRows = rows.map(row => ({
          ...row,
          is_synced: row.is_synced === 1, // Ensure boolean conversion
          is_deleted: row.is_deleted === 1, // Ensure boolean conversion
        }));

        console.log('Fetched and transformed products:', transformedRows);
        resolve(transformedRows);
      }
    });
  });
});


ipcMain.handle('getUnSyncProducts', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products WHERE is_synced = 0', [], (err, rows) => {
      if (err) {
        console.error('Error fetching all unsync products:', err);
        reject('Error fetching all products');
      } else {
        console.log('Fetched products:', rows);
        resolve(rows); // Return all products as an array
      }
    });
  });
});

ipcMain.handle('markProductsAsSynced', async (event) => {
  return new Promise((resolve, reject) => {
    // Get current timestamp
    const currentTimestamp = new Date().toISOString();

    // Start a transaction for better performance
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // First, select all unsynced products
      db.all('SELECT * FROM products WHERE is_synced = 0', [], (err, products) => {
        if (err) {
          console.error('Error selecting unsynced products:', err);
          db.run('ROLLBACK');
          return reject('Error selecting unsynced products');
        }

        if (!products || products.length === 0) {
          db.run('ROLLBACK');
          return resolve({ success: true, updatedCount: 0, message: 'No unsynced products found' });
        }

        // Keep track of successful updates
        let successCount = 0;

        // Update each product
        products.forEach((product) => {
          db.run(
            'UPDATE products SET is_synced = 1, lastSyncDate = ? WHERE sync_id = ?',
            [currentTimestamp, product.sync_id],
            (updateErr) => {
              if (updateErr) {
                console.error(`Error updating product ${product.sync_id}:`, updateErr);
              } else {
                successCount++;
              }
            }
          );
        });

        // Commit the transaction
        db.run('COMMIT', (commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction:', commitErr);
            reject('Error updating products');
          } else {
            console.log(`Updated ${successCount} products with lastSyncDate ${currentTimestamp}`);
            resolve({
              success: true,
              updatedCount: successCount,
              lastSyncDate: currentTimestamp,
              products: products
            });
          }
        });
      });
    });
  });
});

// Expose the database functions to the renderer process (Angular)
//get product by Id
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

//add product
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

ipcMain.handle('deletePro', async (event, productId) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM products WHERE id = ?', [productId], function (err) {
      if (err) {
        reject('Error deleting product');
      } else {
        if (this.changes === 0) {
          reject('Product not found');
        } else {
          resolve({ message: 'Product deleted successfully', id: productId });
        }
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
