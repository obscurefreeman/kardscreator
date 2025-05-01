const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 500,
    minHeight: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/logo.ico')
  })

  // 加载你的HTML文件
  mainWindow.loadFile('index.html')

  // 添加窗口控制IPC通信
  ipcMain.on('window-minimize', () => mainWindow.minimize())
  ipcMain.on('window-maximize', () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  })
  ipcMain.on('window-close', () => mainWindow.close())

  // 添加捕获页面的 IPC 处理
  ipcMain.on('capture-page', (event, rect) => {
    const mainWindow = BrowserWindow.getFocusedWindow()
    
    mainWindow.webContents.capturePage({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    }).then(image => {
      event.reply('capture-page-reply', image)
    }).catch(err => {
      console.error('捕获页面失败:', err)
      event.reply('capture-page-reply', null)
    })
  })

  // 添加保存图片的 IPC 处理
  ipcMain.on('save-card-image', (event, { dataURL, cardName }) => {
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, '')
    
    // 使用保存文件对话框
    dialog.showSaveDialog({
      title: '保存卡片图片',
      defaultPath: `${cardName}_${Date.now()}.png`,
      filters: [
        { name: 'PNG Images', extensions: ['png'] }
      ]
    }).then(result => {
      if (!result.canceled && result.filePath) {
        const filePath = result.filePath
        
        fs.writeFile(filePath, base64Data, 'base64', (err) => {
          if (err) {
            console.error('保存图片失败:', err)
            event.reply('save-card-image-reply', { success: false, error: err.message })
          } else {
            event.reply('save-card-image-reply', { success: true, path: filePath })
          }
        })
      } else {
        event.reply('save-card-image-reply', { success: false, error: '取消保存' })
      }
    }).catch(err => {
      console.error('保存文件对话框失败:', err)
      event.reply('save-card-image-reply', { success: false, error: err.message })
    })
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 