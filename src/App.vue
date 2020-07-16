<template>
  <div>
    <Example />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Example from './components/Example.vue'

export default Vue.extend({
  name: 'App',
  components: {
    Example
  }
});
</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>
