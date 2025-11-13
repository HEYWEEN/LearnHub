<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/layout/Navbar.vue'
</script>

<style>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>