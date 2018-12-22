<template>
  <div class="header">
    <button class="btn-close" v-on:click="hideEvent">
      <i class="ion-minus"></i>
    </button>
    <div class="header-wrapper">
      <div class="header-layout">
        <h2 class="header-msg">{{ msg }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");

export default {
  name: "Header",
  props: {
    msg: String
  },
  methods: {
    hideEvent: function() {
      ipcRenderer.send("hideEvent");
    }  
  }
};
</script>
<style scoped>
.btn-close {
  position: absolute;
  top: 10px;
  right: 5px;
  z-index: 99;
  border: 0;
  background-color: transparent;
  cursor: pointer;
}
.header-wrapper {
  background-color: #fff;
  border-bottom: 2px solid #000;
  border-radius: 6px 6px 0 0;
  clear: both;
  content: "";
  display: table;
  margin: 0 auto;
  width: 100%;
}
.header-layout {
  webkit-box-direction: normal;
  webkit-box-orient: horizontal;
  align-items: center;
  display: flex;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 15px auto 0;
  ms-flex-align: center;
  ms-flex-direction: row;
  ms-flex-pack: justify;
  padding: 0 0 5px;
  position: relative;
  width: 100%;
}
.header-msg {
  color: #333;
  float: left;
  font: 700 18px/1 Roboto, Arial, sans-serif;
  margin: 0;
  max-width: 470px;
  word-break: break-word;
}
</style>
