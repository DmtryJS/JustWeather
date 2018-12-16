const {app, Menu, ipcMain, Tray, BrowserWindow, webContents} = require('electron')

const electron = require('electron')
const path = require('path')
const url = require('url')
let icon_path = path.join(app.getAppPath(), 'img', 'icon.png')

let mainWindow
let tray = null

app.on('window-all-closed', function () {
    app.quit()
})

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow(
    {
      width: 460, 
      height: 200,
      show: false, //по умолчанию скрываем окно
      resizable: false, //запрет resize
      //resizable: true, //запрет resize
      skipTaskbar: true, //запрет отображения в трее
      icon: icon_path,
     /* transparent: true,*/
      frame: false,
      toolbar: false
    })

    routeTo(mainWindow, 'index.html')
    
    mainWindow.on('closed', function () {

    mainWindow = null
  })

  //убрать меню
  mainWindow.setMenuBarVisibility(false)

  mainWindow.on('show', function() {
  tray.setHighlightMode('always')
  })

  mainWindow.on('hide', function() {
    tray.setHighlightMode('never')
  })
}

app.on('ready', function() { 
  createWindow()
  //mainWindow.webContents.openDevTools() //открыть дев тул
  createTray()
})

function createTray()
{
  let traiIconPath = path.join(app.getAppPath(), 'img', 'preloader_tray_icon.png')
  tray = new Tray(traiIconPath)
  tray.setToolTip('Запрос погоды...')
  
  const contextMenu = Menu.buildFromTemplate(
    [ 
      {
        label: 'Settings', 
        type: 'normal',

        click: function() 
        {
          routeTo(mainWindow, 'settings.html')
          let contents = mainWindow.webContents
          
          /*setTimeout(function(){
            if(!mainWindow.isVisible())
            {
              showWindow()
            }
          }, 200)*/
          contents.on('dom-ready', function()
          {
            if(!mainWindow.isVisible())
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
          mainWindow = null
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
  if (mainWindow.isVisible()) 
  {
    mainWindow.hide()
  } else 
  {
    showWindow()
  }
}

function showWindow() {
  var position = getPosition();
  mainWindow.setPosition(position.x, position.y, false)
  mainWindow.show()
  mainWindow.focus()
}

function getPosition()
{
  var screen = electron.screen,
      mainScreen = screen.getPrimaryDisplay(),
      tray_icon = tray.getBounds(),

      appWidth = mainWindow.getBounds().width,
      appHeight = mainWindow.getBounds().height,
      displayHeight = mainScreen.bounds.height,
      displayWidth = mainScreen.bounds.width;
       
  var x = tray_icon.x + (tray_icon.width/2 - appWidth/2);
      y = displayHeight - appHeight - 50; 

      //если окно вылазит за края дисплея, 
      //пока вариант только для классического расположения панели, те внизу.
      if ((x + appWidth - 10) > displayWidth)
      {
        x = displayWidth - appWidth - 10;
      }

  return {x : x, y : y}
}

ipcMain.on('hideEvent', (event, arg) => {
  toggleWindow();
})

ipcMain.on('routerEvent', function(event, arg) {
  routeTo(mainWindow, arg)
})

function routeTo(win, to)
{
  win.loadURL(url.format({
          pathname: path.join(__dirname, to),
          protocol: 'file:',
          slashes: true
          }))
}
//обновление иконки после прихода погоды
ipcMain.on('updateTrayIconEvent', (event, arg) => {
  tray.setToolTip('Температура на улице ' + arg.today_temp + '°C')
  let iconPath = path.join(app.getAppPath(), 'img', arg.icon + '.png')
  tray.setImage(iconPath)
})
