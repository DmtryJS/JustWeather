<template>
  <div>
    <div class="error" v-if="error_message.length > 0">{{ error_message }}</div>
    <div class="widget-left__body" v-show="show" style="display: none">
      <button type="button" class="btn btn-refresh" v-on:click="getData">
        <i class="ion-android-refresh"></i>
      </button>
      <div class="weather-left-card">
        <div class="weather-left-card__row1">
          <i v-bind:class="[today_weather_icon]"></i>
          <div class="weather-left-card__col">
            <p class="weather-left-card__number">
              {{ today_temp }}
              <span class="weather-left-card__degree">°C</span>
            </p>
          </div>
        </div>
        <div class="weather-left-card__row2">
          <p class="weather-left-card__means">{{ description }}</p>
          <p class="weather-left-card__wind">{{ winds }}</p>
        </div>
      </div>
      <div class="widget-left__calendar">
        <ul id="calendar" class="calendar">
          <li v-for="day in days" :key="day.id">
            {{ formatData(day.dt) }}
            <br>
            <i v-bind:class="['wi ' + 'wi-' + day.weather[0].icon]"></i>
            <br>
            {{ roundCelsius(day.temp.day) }}
            <span>&deg;С</span>
            <br>
            {{ convertPlesure(day.pressure) }}
            <span>mmHg</span>
            <br>
          </li>
        </ul>
      </div>
      <div style="clear:both"></div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron"),
  axios = require("axios"),
  baseUrl = "http://api.openweathermap.org/data/2.5/forecast/daily",
  count = 4; //количество дней

export default {
  name: "Weather",
  props: {
    city: String,
    token: String
  },
  data: function() {
    return {
      today_temp: "",
      clouds: "",
      winds: "",
      description: "",
      days: [],
      show: false,
      today_weather_icon: "",
      error_message: ""
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData: function() {
      let a = this;
      axios
        .get(a.getRequestString())
        .then(function(response) {
          a.error_message = "";
          a.render(response.data);
        })
        .catch(function(error) {
          a.error_message =
            "Error communicating with the weather provider.\n" +
            error.response.data.message +
            " \n" +
            "Response status: " +
            error.response.status;
        });
    },

    formatData: function(timestamp) {
      let ts = timestamp * 1000,
        date = new Date(ts),
        year = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate();

      return d + "." + m + "." + year;
    },

    render: function(data) {
      let d = data.list;
      this.show = true;
      this.city_name = data.city.name;
      this.today_temp = this.roundCelsius(d[0].temp.day);
      this.clouds = d[0].weather[0].main;
      this.winds =
        "Wind: " +
        d[0].speed +
        " m/s, Pressure: " +
        this.convertPlesure(d[0].pressure) +
        "mmHg";
      this.today_weather_icon = "wi wi-" + d[0].weather[0].icon;
      this.description = d[0].weather[0].description;
      this.days = data.list.splice(1, count); //удаляем из отрисовки 1 сегодняшний день, он и так отображается отдельно.

      let toApp = {
        icon: d[0].weather[0].icon,
        today_temp: this.today_temp
      };
      ipcRenderer.send("updateTrayIconEvent", toApp);
    },

    roundCelsius: function(float) {
      return Math.round(float * 10) / 10;
    },

    convertPlesure: function(plesureOnHpa) {
      return Math.round(plesureOnHpa * 0.75);
    },

    getRequestString: function() {
      return baseUrl +
        "?q=" +
        this.city +
        "&APPID=" +
        this.token +
        "&units=metric" +
        "&cnt=" +
        count;
    }
  }
};
</script>
<style src="./../assets/css/weather-icons.css"></style>
<style scoped>
.widget-left__body {
  display: flex;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  webkit-box-direction: normal;
}

.widget-left__body {
  border-radius: 0 0 6px 6px;
  flex-direction: row;
  justify-content: space-around;
  ms-flex-direction: row;
  ms-flex-pack: distribute;
  width: 100%;
}
.weather-left-card {
  float: left;
}
.weather-left-card__row1 {
  align-items: center;
  display: flex;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  flex-direction: row;
  height: 100px;
  width: auto;
}
.weather-left-card__row1 i {
  margin: 0 10px;
  font-size: 46px;
}
.weather-left-card__col {
  align-items: center;
  display: flex;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: flex-start;
}
.weather-left-card__col span {
  color: #333;
  padding-top: 3px;
}
.weather-left-card__number {
  color: #333;
  font: 600 36px/1 Oswald, Arial, sans-serif;
  letter-spacing: -4px;
  margin: 0 auto;
  padding-right: 15px;
  padding-top: 20px;
}
.weather-left-card__degree {
  font: 700 36px/1 Oswald, Arial, sans-serif;
}
.weather-left-card__means {
  color: #333;
  font: 700 16px/1 Roboto, Arial, sans-serif;
  margin: 0 0 5px;
  text-align: center;
  text-transform: capitalize;
}
.weather-left-card__wind {
  color: #333;
  font: 400 12px/1 Roboto, Arial, sans-serif;
  margin: 0;
  padding: 2px 0;
  text-align: center;
}
.widget-left__calendar {
  float: left;
  margin-left: -6px;
  margin-top: 5px;
}
.calendar {
  align-items: baseline;
  display: flex;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: space-between;
  list-style: none;
  margin-bottom: 17px;
  margin-top: 16px;
  margin-left: 8px;
  ms-flex-align: baseline;
  ms-flex-direction: row;
  ms-flex-pack: justify;
  padding: 0;
  webkit-align-items: baseline;
  webkit-box-align: baseline;
  webkit-box-direction: normal;
  webkit-box-orient: horizontal;
  webkit-box-pack: justify;
  webkit-flex-direction: row;
  webkit-justify-content: space-between;
  width: 205px;
}
.calendar li {
  margin-left: 5px;
}

.calendar span {
  font-size: 11px;
}
ul.calendar i {
  margin: 10px;
  font-size: 24px;
}
.btn-refresh {
  position: absolute;
  top: 48px;
  left: 10px;
}
</style>
