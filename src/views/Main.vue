<template>
  <div class="home">
    <Header v-bind:msg="message"></Header>
    <Weather v-bind:city="city" v-bind:token="token"></Weather>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Weather from "@/components/Weather.vue";
const loadIniFile = require("read-ini-file"),
  path = require("path"),
  settings_path = path.join("settings.ini"),
  settings = loadIniFile.sync(settings_path);

export default {
  name: "main",
  data: function() {
    return {
      city: settings.city,
      token: settings.token
    };
  },
  components: {
    Header,
    Weather
  },
  computed: {
    message: function() {
      return "Weather for " + this.city;
    }
  }
};
</script>