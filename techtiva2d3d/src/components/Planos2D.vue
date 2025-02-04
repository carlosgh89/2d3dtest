

<template>
  <canvas ref="canvas" @mousedown="startDraw" @mouseup="endDraw" @mousemove="draw" @wheel="zoom"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWallStore } from '../store';

const canvas = ref(null);
const store = useWallStore();
let ctx, isDrawing = false, startX, startY;
let scale = 1;
let offsetX = 0;
let offsetY = 0;

onMounted(() => {
  ctx = canvas.value.getContext('2d');
  canvas.value.width = canvas.value.clientWidth;
  canvas.value.height = canvas.value.clientHeight;
  drawAllWalls();
});

const getCanvasCoordinates = (event) => {
  const rect = canvas.value.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - offsetX) / scale,
    y: (event.clientY - rect.top - offsetY) / scale
  };
};

const startDraw = (event) => {
  isDrawing = true;
  const { x, y } = getCanvasCoordinates(event);
  startX = x;
  startY = y;
};

const endDraw = (event) => {
  if (!isDrawing) return;
  isDrawing = false;
  const { x, y } = getCanvasCoordinates(event);
  const endX = x;
  const endY = y;
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  store.addWall({ startX, startY, endX, endY });
  drawAllWalls();
};

const draw = (event) => {
  if (!isDrawing) return;
  const { x, y } = getCanvasCoordinates(event);
  const currentX = x;
  const currentY = y;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  drawAllWalls();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
};

const drawAllWalls = () => {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(offsetX / scale, offsetY / scale);
  store.walls.forEach(wall => {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wall.startX, wall.startY);
    ctx.lineTo(wall.endX, wall.endY);
    ctx.stroke();
  });
  ctx.restore();
};

const zoom = (event) => {
  event.preventDefault();
  const zoomFactor = 1.1;
  const { x, y } = getCanvasCoordinates(event);
  if (event.deltaY < 0) {
    scale *= zoomFactor;
    offsetX = x * (1 - zoomFactor) + offsetX * zoomFactor;
    offsetY = y * (1 - zoomFactor) + offsetY * zoomFactor;
  } else {
    scale /= zoomFactor;
    offsetX = x * (1 - 1 / zoomFactor) + offsetX / zoomFactor;
    offsetY = y * (1 - 1 / zoomFactor) + offsetY / zoomFactor;
  }
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  drawAllWalls();
};
</script>

<style scoped>
canvas {
  border: 1px solid black;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>