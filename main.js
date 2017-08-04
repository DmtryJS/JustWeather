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
      width: 460, 
      height: 220,
      show: false, //по умолчанию скрываем окно
      resizable: false, //запрет resize
      skipTaskbar: true, //запрет отображения в трее
      title: 'Погода',
      icon: icon_path,
      transparent: true,
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
      tray_icon = tray.getBounds();
       
  var x = tray_icon.x + (tray_icon.width/2 - mainWindow.getBounds().width/2);
      y = mainScreen.bounds.height - mainWindow.getBounds().height - 30; 

      //если окно вылазит за края.
      if ((x + mainWindow.getBounds().width - 10) > mainScreen.bounds.width)
      {
        x = mainScreen.bounds.width - mainWindow.getBounds().width - 10;
      }

  return {x : x, y : y}
}

