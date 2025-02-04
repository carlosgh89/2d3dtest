<template>
    <canvas ref="canvas3d"></canvas>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import * as BABYLON from 'babylonjs';
  import { useWallStore } from '../store';
  
  const canvas3d = ref(null);
  const store = useWallStore();
  let scene, engine;
  
  onMounted(() => {
    engine = new BABYLON.Engine(canvas3d.value, true);
    scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas3d.value, true);
    new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    engine.runRenderLoop(() => scene.render());
  });
  
  watch(
  () => store.walls,
  (newWalls) => {
    scene.meshes.forEach(mesh => mesh.dispose());
    newWalls.forEach(wall => {
      const startX = wall.startX / 50 - 2.5;
      const startY = wall.startY / 50 - 2.5;
      const endX = wall.endX / 50 - 2.5;
      const endY = wall.endY / 50 - 2.5;

      const width = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const height = 2;
      const depth = 0.2;

      const positionX = (startX + endX) / 2;
      const positionY = (startY + endY) / 2;
      const positionZ = height / 2;

      const wallMesh = BABYLON.MeshBuilder.CreateBox('wall', { width, height, depth }, scene);
      wallMesh.position.set(positionX, positionZ, positionY);

      const angle = Math.atan2(endY - startY, endX - startX);
      wallMesh.rotation.y = -angle;
    });
  },
  { deep: true }
);
  </script>
  
  <style>
  canvas {
    width: 50%;
    height: 100%;
  }
  </style>