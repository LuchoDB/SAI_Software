const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { DatabaseManager } = require('./database.cjs');

let mainWindow = null;
let dbManager = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: 'SAI Consult - Software de Ingeniería Aeronáutica',
    icon: path.join(__dirname, '../public/sai_logo_emblem.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const devUrl = process.env.ELECTRON_DEV_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupIpcHandlers() {
  ipcMain.handle('db:getClients', () => dbManager.getClients());
  ipcMain.handle('db:saveClient', (_e, client) => dbManager.saveClient(client));
  ipcMain.handle('db:deleteClient', (_e, id) => dbManager.deleteClient(id));
  ipcMain.handle('db:updateDocStatus', (_e, clientId, docId, status, notes) =>
    dbManager.updateDocumentStatus(clientId, docId, status, notes)
  );

  ipcMain.handle('db:getWindStudies', (_e, clientId) => dbManager.getWindStudies(clientId));
  ipcMain.handle('db:saveWindStudy', (_e, study) => dbManager.saveWindStudy(study));

  ipcMain.handle('db:getLadStudies', (_e, clientId) => dbManager.getLadStudies(clientId));
  ipcMain.handle('db:saveLadStudy', (_e, study) => dbManager.saveLadStudy(study));

  ipcMain.handle('db:getLadhStudies', (_e, clientId) => dbManager.getLadhStudies(clientId));
  ipcMain.handle('db:saveLadhStudy', (_e, study) => dbManager.saveLadhStudy(study));
}

app.whenReady().then(() => {
  const userDataPath = app.getPath('userData');
  dbManager = new DatabaseManager(userDataPath);
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
