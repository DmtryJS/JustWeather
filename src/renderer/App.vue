<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style src="../assets/css/ionicons.css"></style>
<style>
body {
  padding: 0px;
  margin: 0px;
  user-select: none;
}
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
#app {
  background-color: #fff;
  border-radius: 6px;
  border-color: #000;
  font: 400 14px/1.3 Oswald, Arial, sans-serif;
  margin: 0 5px 5px;
  width: 435px;
  position: relative;
  padding: 5px;
}
button,
button:active,
button:focus {
  outline: none;
}
.btn {
  border: 0;
  background-color: transparent;
  cursor: pointer;
}
</style>
