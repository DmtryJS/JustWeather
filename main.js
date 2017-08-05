const {app, Menu, ipcMain, Tray} = require('electron')

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
var icon_path = './img/icon.png'

let mainWindow
let tray = null

app.on('window-all-closed', function () {
    app.quit()
})

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow(
    {
      width: 450, 
      height: 220,
      show: false, //по умолчанию скрываем окно
      resizable: true, //запрет resize
      skipTaskbar: true, //запрет отображения в трее
      icon: icon_path,
     // transparent: true,
      frame: false,
      toolbar: false
    })

    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

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
  createWindow();
  createTray();
})

function createTray()
{
  tray = new Tray(icon_path)
  tray.setToolTip('Погодный виджет')
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
      y = displayHeight - appHeight - 30; 

      //если окно вылазит за края дисплея, пока вариант только для классического расположения
      if ((x + appWidth - 10) > displayWidth)
      {
        x = displayWidth - appWidth - 10;
      }

  return {x : x, y : y}
}

ipcMain.on('hideEvent', (event, arg) => {
  toggleWindow();
})

//обновление иконки после прихода погоды
ipcMain.on('updateTrayIconEvent', (event, arg) => {
  tray.setToolTip('Температура на улице ' + arg.today_temp + '°C');
  tray.setImage('./img/' + arg.icon + '.png');
})
