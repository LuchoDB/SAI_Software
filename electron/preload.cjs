const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  getClients: () => ipcRenderer.invoke('db:getClients'),
  saveClient: client => ipcRenderer.invoke('db:saveClient', client),
  deleteClient: id => ipcRenderer.invoke('db:deleteClient', id),
  updateDocStatus: (clientId, docId, status, notes) =>
    ipcRenderer.invoke('db:updateDocStatus', clientId, docId, status, notes),
  getWindStudies: clientId => ipcRenderer.invoke('db:getWindStudies', clientId),
  saveWindStudy: study => ipcRenderer.invoke('db:saveWindStudy', study),
  getLadStudies: clientId => ipcRenderer.invoke('db:getLadStudies', clientId),
  saveLadStudy: study => ipcRenderer.invoke('db:saveLadStudy', study),
  getLadhStudies: clientId => ipcRenderer.invoke('db:getLadhStudies', clientId),
  saveLadhStudy: study => ipcRenderer.invoke('db:saveLadhStudy', study)
});
