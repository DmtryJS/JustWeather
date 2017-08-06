const {ipcRenderer} = require('electron')
const axios = require('axios')
const loadIniFile = require('read-ini-file')
const path = require('path')
const settings_path = path.join(__dirname, 'settings.ini')
const settings = loadIniFile.sync(settings_path)

const token = settings.token,
      city = settings.city,
      count = 4, //количество дней
      baseUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily',
      requestString = baseUrl + '?q=' + city + '&APPID=' + token + '&units=metric' + '&cnt=' + count,
      updateInterval = 10 * 1000 * 60; // первая цифра задается в минутах (сейчас 10 минут). 

var vue_app = new Vue({
   	          el: '#app',
   	          data: {
  	             city: city,
  	             today_temp: '',
  	             clouds: '',
  	             winds: '',
  	             description: '',
                 days: [],
                 show: false,
                 today_weather_icon: ""
   	            },
              
              methods: {

                getData: function () {
                    let a = this;
                    axios.get(requestString)
                          .then(function (response) {
                              a.render(response.data);
                          })
                          .catch(function (error) {
                              console.log(error);
                          });
                }, 

                formatData: function(timestamp)
                {
                    let ts = timestamp * 1000,
                        date = new Date(ts),
                        year = date.getFullYear(),
                        m = date.getMonth() + 1,
                        d = date.getDate();
                    
                    return d + '.' + m + '.' + year;
                },

                render: function(data)
                {
                    let d = data.list;
                    this.show = true;
                    this.city_name = data.city.name;
                    this.today_temp = this.roundCelsius(d[0].temp.day);
                    this.clouds = d[0].weather[0].main;
                    this.winds = 'Ветер: ' + d[0].speed + ' м/с, Давление: ' + this.convertPlesure(d[0].pressure) + 'mmHg';
                    this.today_weather_icon = 'wi wi-' + d[0].weather[0].icon;
                    this.description = d[0].weather[0].description;
                    this.days = data.list.splice(1,  count); //удаляем из отрисовки 1 сегодняшний день, он и так отображается отдельно.
                    
                    let toApp = { 
                                  'icon': d[0].weather[0].icon,
                                  'today_temp': this.today_temp
                                };

                    ipcRenderer.send('updateTrayIconEvent', toApp);
                },

                roundCelsius: function(float)
                {
                    return Math.round(float * 10) / 10;
                },

                convertPlesure: function(plesureOnHpa)
                {
                    return Math.round(plesureOnHpa * 0.75);
                },

                hideEvent: function()
                {
                    ipcRenderer.send('hideEvent');
                }
              },

                mounted() {
                    this.getData();
                }
  	 });
//периодическое обновление погоды
setInterval(vue_app.getData, updateInterval);