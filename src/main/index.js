import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const { setup: setupPushReceiver } = require('electron-push-receiver')
import icon from '../../resources/icon.ico?asset'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
    // transparent: true
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  setupPushReceiver(mainWindow.webContents)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  if (app.isPackaged) {
    autoUpdater.checkForUpdates()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//-------------------- print function -----------------

// List of all options at -
// https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback

async function getProducts() {
  const win = new BrowserWindow({ show: false })
  const res = win.webContents.getPrintersAsync()
  return res
}

ipcMain.handle('products', getProducts)

ipcMain.on('checkForUpdate', () => {
  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'info'
  autoUpdater.autoDownload = false
  autoUpdater.checkForUpdatesAndNotify()
})

ipcMain.on('test', () => {
  log.info('hello World!')
  mainWindow.webContents.send('message', { version: '1.0.0', lastestVersion: '1.0.1' })
})

ipcMain.on('downloadUpdate', () => {
  autoUpdater.downloadUpdate()
})

ipcMain.on('quitAndInstall', () => {
  autoUpdater.quitAndInstall()
})

const printOptions = {
  silent: true,
  printBackground: true,
  color: true,
  margin: {
    marginType: 'default'
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1
}

//handle print
ipcMain.handle('printComponent', async (event, url) => {
  const win = new BrowserWindow({ show: false })

  win.webContents.on('did-finish-load', () => {
    win.webContents.print(printOptions, (success, failureReason) => {
      console.log('Print Initiated in Main...')
      if (!success) console.log(failureReason)
    })
  })

  await win.loadURL(url)
  return 'shown print dialog'
})

// handle preview
ipcMain.handle('previewComponent', async (event, url) => {
  let win = new BrowserWindow({
    title: 'Print Preview',
    show: false,
    autoHideMenuBar: true
  })

  win.webContents.once('did-finish-load', () => {
    win.webContents
      .printToPDF(printOptions)
      .then((data) => {
        const buf = Buffer.from(data)
        data = buf.toString('base64')
        const url = 'data:application/pdf;base64,' + data

        win.webContents.on('ready-to-show', () => {
          win.once('page-title-updated', (e) => e.preventDefault())
          win.show()
        })

        win.webContents.on('closed', () => (win = null))
        win.loadURL(url)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  await win.loadURL(url)
  return 'shown preview window'
})

function sendStatusToWindow(text) {
  mainWindow.webContents.send('message', text)
}

autoUpdater.on('checking-for-update', () => {
  log.info('print from checking-for-update')
  sendStatusToWindow({ type: 'checking-for-update' })
})

autoUpdater.on('update-available', ({ releaseName }) => {
  log.info('print from update-available')
  sendStatusToWindow({ type: 'update-available', releaseName })
})

autoUpdater.on('update-not-available', () => {
  log.info('print from update-not-available')
  sendStatusToWindow({ type: 'update-not-available' })
})

autoUpdater.on('error', (error) => {
  log.info('print from update-error' + error)
  sendStatusToWindow({ type: 'error', error })
})

autoUpdater.on('download-progress', (progressObj) => {
  // let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  // log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  // const log_message = progressObj.percent + '%'
  sendStatusToWindow({ type: 'download-progress', progressObj })
})

autoUpdater.on('update-downloaded', () => {
  log.info('update-downloaded')
  sendStatusToWindow({ type: 'update-downloaded' })
})
