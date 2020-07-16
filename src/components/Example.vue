<template>
  <div>
    <div class="header">
      header
    </div>
    <div class="main">
      <div class="menu">
        menu
      </div>
      <div class="container" ref="container" />
    </div>
    <div class="footer">
      footer
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { render } from './ImageViewer'

export default Vue.extend({
  name: 'Example',
  props: {
    //
  },
  mounted() {
    render(
      this.$refs.container as HTMLDivElement,
      'https://i.pinimg.com/originals/dd/23/63/dd2363f9c37d03d5d4ae40854f9cebaf.jpg'
    )
  }
})
</script>

<style scoped>
  .header, .footer {
    height: 50px;
  }
  .main {
    display: flex;
  }
  .menu {
    width: 250px;
  }
  .container {
    width: calc(100vw - 250px);
    height: calc(100vh - 100px);
    background-color: #eeeeee;
  }
</style>
