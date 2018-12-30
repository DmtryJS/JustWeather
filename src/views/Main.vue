<template>
  <div class="home">
    <Header v-bind:msg="message"></Header>
    <Weather v-bind:city="city" v-bind:token="token"></Weather>
  </div>
</template>

<script>
import Header from "./../components/Header.vue";
import Weather from "./../components/Weather.vue";
import { remote } from 'electron';
const config = require('electron-json-config');

export default {
  name: "main",
  data: function() {
    return {
      city: config.get('city'),
      token: config.get('token')
    };
  },
  components: {
    Header,
    Weather
  },
  computed: {
    message: function() {
      if(!config.has("city") || !config.has("token")) {
        return "Please configure city and token";
      }
      return "Weather for " + this.city;
    }
  }
};
</script>