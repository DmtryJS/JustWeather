Weather widget for PC 
-----------------------------------

Hi, this is a simple weather widget, is an experiment to try [Electron](https://electronjs.org/) and [Vue Js](https://vuejs.org/).  
The widget uses a free API [Openweathermap](https://openweathermap.org/). The idea is that the application should be   
cross-platform, as it is written using Node JS, but I tried it only on Windows 8 & 10

### Install and starting

You should already have [Node JS](https://nodejs.org/en/)  
You will need a special key, which can be obtained free of charge from the weather service  
<https://openweathermap.org/appid>  

```bash
git clone https://github.com/DmtryJS/weather_widjet.git
cd weather_widjet
npm install
npm start   //start application
```
click to icon in tray -> settings -> Application token  
Insert your security key from <https://openweathermap.org/appid>

### Package and build

By default package.json contains windows ready build config. After the build, a folder 'dist' is created that contains the installer executable file. 
The application icon appears on the desktop.

```bash
npm run dist
```

### Screenshots  

in Tray  
![general](https://github.com/DmtryJS/weather_widjet/blob/master/screens/1.png)

settings tray menu  
![settings](https://github.com/DmtryJS/weather_widjet/blob/master/screens/2.png)

city select  
![city_select](https://github.com/DmtryJS/weather_widjet/blob/master/screens/3.png)



