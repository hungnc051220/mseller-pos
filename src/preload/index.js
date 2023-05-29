import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

const {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED,
} = require ('electron-push-receiver/src/constants')

// Listen for service successfully started
ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
  console.log('service successfully started', token)
})

// Handle notification errors
ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
  console.log('notification error', error)
})

// Send FCM token to backend
ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
  console.log('token updated', token)
})

// // Display notification
// ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
//   // check to see if payload contains a body string, if it doesn't consider it a silent push
//   if (serverNotificationPayload.notification.body){
//     // payload has a body, so show it to the user
//     console.log('display notification', serverNotificationPayload)
//     let myNotification = new Notification(serverNotificationPayload.notification.title, {
//       body: serverNotificationPayload.notification.body
//     })
    
//     myNotification.onclick = () => {
//       console.log('Notification clicked')
//     }  
//   } else {
//     // payload has no body, so consider it silent (and just consider the data portion)
//     console.log('do something with the key/value pairs in the data', serverNotificationPayload.data)
//   }
// })

// Start service
const senderId = '380701649048' // <-- replace with FCM sender ID from FCM web admin under Settings->Cloud Messaging
console.log('starting service and registering a client')
ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId);

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
