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
    contextBridge.exposeInMainWorld('electronAPI', {
      printComponent: async (url, callback) => {
        let response = await ipcRenderer.invoke('printComponent', url)
        callback(response)
      },
      previewComponent: async (url, callback) => {
        let response = await ipcRenderer.invoke('previewComponent', url)
        callback(response)
      },
      getMessage: (callback) => ipcRenderer.on('message', callback),
      checkForUpdate: () => ipcRenderer.send("checkForUpdate"),
      downloadUpdate: () => ipcRenderer.send("downloadUpdate"),
    })
    contextBridge.exposeInMainWorld('Products', {
      products: () => ipcRenderer.invoke('products').then((result) => result)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

