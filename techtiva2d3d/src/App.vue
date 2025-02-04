<template>
  <div class="container">
    <Planos2D />
    <Vista3D />
  </div>
</template>

<script setup>
import Planos2D from './components/Planos2D.vue';
import Vista3D from './components/Vista3D.vue';
</script>

<style>
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
}
</style>