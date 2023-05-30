import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld("electronAPI", {
      printComponent: async (url, options, callback) => {
        let response = await ipcRenderer.invoke("printComponent", url, options);
        callback(response);
      },
      previewComponent: async (url, callback) => {
        let response = await ipcRenderer.invoke("previewComponent", url);
        callback(response);
      },
    });
    contextBridge.exposeInMainWorld('Products', {
      products: () => ipcRenderer.invoke('products').then(result => result)
  })
    
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
