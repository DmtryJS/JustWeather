<template>
  <div class="home">
    <Header city='Saransk'></Header>
    <Weather></Weather>
  </div>
</template>

<script>

import Header from '@/components/Header.vue'
import Weather from '@/components/Weather.vue'

export default {
  name: 'main',
  components: {
    Header,
    Weather
  }
}
</script>