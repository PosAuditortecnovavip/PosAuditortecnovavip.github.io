const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Tecnova VIP - Audity Pro",
    autoHideMenuBar: true, // Oculta el menú de arriba para que parezca una app nativa
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Carga la app web compilada que está en la carpeta dist
  win.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});