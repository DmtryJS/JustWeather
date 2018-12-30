<template>
  <div class="settings">
      <Header msg='Settings'></Header>
      <SettingsForm></SettingsForm>
  </div>
</template>
<script>
import Header from "./../components/Header.vue";
import SettingsForm from "./../components/SettingsForm.vue";
export default {
  name: "main",
   components: {
    Header,
    SettingsForm
 }
};
</script>