const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200, // Increased width for better layout
    height: 800, // Increased height
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Recommended for security
      nodeIntegration: false // Recommended for security - keep renderer process separate
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:9002'); // Port from package.json dev script
    mainWindow.webContents.openDevTools(); // Open DevTools in development
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'out/index.html'), // Path to exported Next.js app
      protocol: 'file:',
      slashes: true
    }));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
