<template>
  <div>
    <div class="settings_container">
      <ul class="form_container">
        <li>
          <label for="city">
            <i class="ion-location"></i> City
          </label>
          <input type="text" name="city" v-model="city" size="16">
          <br>
        </li>
        <li>
          <label for="token">
            <i class="ion-key"></i> Application token
          </label>
          <input type="text" name="token" v-model="token_value" size="32">
          <br>
        </li>
      </ul>
      <div class="apply">
        <button class="apply_button" v-on:click="apply">
          <i class="ion-checkmark-circled"></i>Apply
        </button>
        <button class="cancel_button" v-on:click="cancel">
          <i class="ion-minus-circled"></i>Cancel
        </button>
      </div>
    </div>
    <div class="city_list_wrapper" v-if="search_visible">
      <ul style="list-style: none">
        <li v-for="city in finded" v-on:click="select" v-bind:key="city.key">{{city}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
const { ipcRenderer } = require("electron");
const loadIniFile = require("read-ini-file");
const writeIniFile = require("write-ini-file");
const path = require("path");
const settings_path = path.join("settings.ini");
const settings = loadIniFile.sync(settings_path);
const cityList = require("../../src/assets/cityList");
//const cityList = ["Razvilka", "Moscow", "Firozpur Jhirka", "Kathmandu", "Kiev"];
export default {
  name: "SettingsForm",
  data: function() {
    return {
      token_value: settings.token,
      city: settings.city,
      citys: [],
      finded: [],
      search_visible: true
    };
  },
  watch: {
    city: function(val) {
      this.finded = [];
      if (val.length >= 2) {
        this.search(val);
      }
    }
  },
  methods: {
    apply: function() {
      writeIniFile(settings_path, {
        token: this.token_value,
        city: this.city
      }).then(function() {
        ipcRenderer.send("routerEvent", "");
      });
    },

    cancel: function() {
      ipcRenderer.send("routerEvent", "");
    },

    search: function(val) {
      let self = this;
      var expr = new RegExp("^" + val, "i");
      self.finded = cityList.filter(function(item) {
        return expr.test(item);
      });
    },

    select: function(elem) {
      let self = this;
      self.city = elem.target.innerText;
      self.search_visible = false;

      setTimeout(function() {
        self.search_visible = true;
        self.finded = [];
      }, 1000);
    }
  }
};
</script>
<style scoped>
ul.form_container {
  width: 430px;
  list-style-type: none;
  list-style-position: outside;
  margin: 0px;
  padding: 0px;
}
.form_container li {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.form_container label {
  width: 150px;
  margin-top: 3px;
  display: inline-block;
  padding: 3px;
}
.form_container input {
  height: 10px;
  width: 220px;
  padding: 5px 8px;
}

.city_list_wrapper {
  position: absolute;
  top: 86px;
  left: 178px;
  width: 239px;
  display: block;
  background: #fff;
}

.city_list_wrapper ul {
  max-height: 55px;
  padding-left: 7px;
  margin: 0;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

.city_list_wrapper ul li {
  list-style: none;
  display: list-item;
  background-image: none;
  cursor: pointer;
}

.city_list_wrapper ul li:hover {
  background-color: #000;
  color: #fff;
}
</style>

