'use strict'

import { app, protocol, BrowserWindow, Menu, ipcMain, Tray } from 'electron'
import Vue from 'vue';
export const EventBus = new Vue();
const electron = require('electron');
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

let imgBasePath;

if(isDevelopment) {
  imgBasePath = path.join('src','assets', 'img');
} else {
  imgBasePath = path.join(path.dirname(__dirname), 'extraResources', 'img');
}

let win;
let tray;
protocol.registerStandardSchemes(['app'], { secure: true })

const trayIcon = path.join(__static, 'img', 'weather.ico');

function createWindow () {
  win = new BrowserWindow({ 
    width: 460, 
    height: 200,
    icon: trayIcon,
    resizable: false,
    skipTaskbar: true,
    frame: false,
    toolbar: false
   })
   
  win.hide()
  routeTo(win, "")

  win.on('closed', () => {
    win = null
  })
   //убрать меню
   win.setMenuBarVisibility(true)

   win.on('show', function() {
   tray.setHighlightMode('always')
   })
 
   win.setMenuBarVisibility(false)
   win.on('hide', function() {
     tray.setHighlightMode('never')
   })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('ready', () => {
  createWindow()
  //win.webContents.openDevTools(); //открыть dev tools
  createTray()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

function createTray()
{
  let traiIconPath = path.join(imgBasePath, 'preloader_tray_icon.png')
  tray = new Tray(traiIconPath)
  tray.setToolTip('Запрос погоды...')
  
  const contextMenu = Menu.buildFromTemplate(
    [ 
      {
        label: 'Settings', 
        type: 'normal',

        click: function() 
        {
          routeTo(win, "#settings")
          let contents = win.webContents

          contents.on('dom-ready', function()
          {
            if(!win.isVisible())
            {
              showWindow()
            }
          })   
        }
      },

      {
        label: 'Exit', 
        type: 'normal', 
      
        click: function() 
        {
          win = null
          app.quit()
        }
      }
    ])
  
  tray.setContextMenu(contextMenu)

  tray.on('click', function() {
  toggleWindow();
})
}

function toggleWindow() 
{
  if (win.isVisible()) 
  {
    win.hide()
  } else 
  {
    showWindow()
  }
}

function showWindow() {
  var position = getPosition();
  win.setPosition(position.x, position.y, false)
  win.show()
  win.focus()
}

function getPosition()
{
  var screen = electron.screen,
      mainScreen = screen.getPrimaryDisplay(),
      tray_icon = tray.getBounds(),

      appWidth = win.getBounds().width,
      appHeight = win.getBounds().height,
      displayHeight = mainScreen.bounds.height,
      displayWidth = mainScreen.bounds.width;
       
  var x = tray_icon.x + (tray_icon.width/2 - appWidth/2),
      y = displayHeight - appHeight - 50; 

      //если окно вылазит за края дисплея, 
      //пока вариант только для классического расположения панели, те внизу.
      if ((x + appWidth - 10) > displayWidth)
      {
        x = displayWidth - appWidth - 10;
      }

  return {x : x, y : y}
}

ipcMain.on('hideEvent', () => {
  toggleWindow();
})

ipcMain.on('routerEvent', function(event, arg) {
  routeTo(win, arg)
})

function routeTo(win, to) {
  if (isDevelopment) {
    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}` + to)
  } else {
    win.loadURL(path.join(__dirname, 'index.html' + to))
  }
}
//обновление иконки после прихода погоды
ipcMain.on('updateTrayIconEvent', (event, arg) => {
  tray.setToolTip('Температура на улице ' + arg.today_temp + '°C')
  let iconPath = path.join(imgBasePath, arg.icon + '.png')
  tray.setImage(iconPath)
})