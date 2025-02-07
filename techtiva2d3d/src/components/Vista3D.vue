
  <template>
    <canvas ref="canvas3d"></canvas>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder } from '@babylonjs/core';
  import { useWallStore } from '../store';
  
  const canvas3d = ref(null);
  const store = useWallStore();
  let scene, engine;
  
  onMounted(() => {
    engine = new Engine(canvas3d.value, true);
    scene = new Scene(engine);
    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas3d.value, true);
    new HemisphericLight('light', new Vector3(0, 1, 0), scene);
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
  
        const wallMesh = MeshBuilder.CreateBox('wall', { width, height, depth }, scene);
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
    width: 100%;
    height: 100%;
  }
  </style>