<template>
  <div class="container">
    <div class="panel">
      <Planos2D />
    </div>
    <div class="panel">
      <Vista3D />
    </div>
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

.panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>