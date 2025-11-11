<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/layout/Navbar.vue'
</script>

<style>
#app {
  font-family: 'Segoe UI', Roboto, sans-serif;
  background-color: #fafafa;
}
</style>