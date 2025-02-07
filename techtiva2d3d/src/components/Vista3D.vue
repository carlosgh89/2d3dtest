<template>
  <canvas ref="canvas3d"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Scene, PerspectiveCamera, WebGLRenderer, HemisphereLight, BoxGeometry, MeshStandardMaterial, Mesh, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useWallStore } from '../store';

const canvas3d = ref(null);
const store = useWallStore();
let scene, camera, renderer, controls;

onMounted(() => {
  // Crear la escena
  scene = new Scene();
  scene.background = new Color(0xeeeeee); // Fondo claro para mejor visibilidad

  // Crear la cámara
  camera = new PerspectiveCamera(75, canvas3d.value.clientWidth / canvas3d.value.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  // Crear el renderizador
  renderer = new WebGLRenderer({ canvas: canvas3d.value });
  renderer.setSize(canvas3d.value.clientWidth, canvas3d.value.clientHeight);

  // Crear una luz
  const light = new HemisphereLight(0xffffff, 0x444444, 1);
  light.position.set(0, 1, 0);
  scene.add(light);

  // Crear los controles de órbita
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Habilitar amortiguación (inercia)
  controls.dampingFactor = 0.25; // Factor de amortiguación
  controls.screenSpacePanning = false; // Deshabilitar el desplazamiento en el espacio de la pantalla
  controls.maxPolarAngle = Math.PI / 2; // Limitar el ángulo polar máximo

  // Render loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update(); // Actualizar los controles
    renderer.render(scene, camera);
  };
  animate();

  // Ajustar el tamaño del renderizador y la cámara cuando la ventana cambie de tamaño
  window.addEventListener('resize', onWindowResize);
});

const onWindowResize = () => {
  camera.aspect = canvas3d.value.clientWidth / canvas3d.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas3d.value.clientWidth, canvas3d.value.clientHeight);
};

watch(
  () => store.walls,
  (newWalls) => {
    // Eliminar todos los objetos de la escena
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Volver a agregar la luz
    const light = new HemisphereLight(0xffffff, 0x444444, 1);
    light.position.set(0, 1, 0);
    scene.add(light);

    // Agregar los nuevos muros
    newWalls.forEach(wall => {
      const startX = wall.startX / 50 - 2.5;
      const startY = wall.startY / 50 - 2.5;
      const endX = wall.endX / 50 - 2.5;
      const endY = wall.endY / 50 - 2.5;

      const width = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const height = 2;
      const depth = 0.2;

      const geometry = new BoxGeometry(width, height, depth);
      const material = new MeshStandardMaterial({ color: 0x8FBC8F });
      const wallMesh = new Mesh(geometry, material);

      const positionX = (startX + endX) / 2;
      const positionY = (startY + endY) / 2;
      wallMesh.position.set(positionX, height / 2, positionY);

      const angle = Math.atan2(endY - startY, endX - startX);
      wallMesh.rotation.y = -angle;

      scene.add(wallMesh);
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