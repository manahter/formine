import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import icon from '../../resources/icon.png?asset'

import { waitForCoreToStart } from './backend'

// let tray = new Tray(nativeImage.createFromPath(icon))

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 780,
    height: 750,
    minWidth: 780,
    minHeight: 750,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
    titleBarOverlay: {
      color: '#00000000',
      symbolColor: '#777777',
      height: 30
    },
    // ...(process.platform === 'linux' ? { icon } : {}),
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
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

  // if (process.env.NODE_ENV !== 'production') {
  //   // Uygulama açıldığında DevTools'u otomatik aç
  //   mainWindow.webContents.openDevTools()
  // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  // ipcMain.on('ping', (event) => {
  //   event.returnValue = 'pong'
  //   return event
  // })

  // formine_core.exe'yi başlat
  // formine_core.exe'nin hazır olmasını bekleyin
  try {
    await waitForCoreToStart()
    console.log('formine_core.exe başarıyla başlatıldı ve hazır.')
    createWindow() // Ana uygulama penceresini aç
  } catch (error) {
    console.error('formine_core.exe başlatılırken bir hata oluştu:', error)
  }

  // createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// Electron kapanırken işlemi sonlandır
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit() // Uygulamayı tamamen kapat
  }
})
