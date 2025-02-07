import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');

// store.js (Pinia Store)
import { defineStore } from 'pinia';

export const useWallStore = defineStore('wallStore', {
  state: () => ({ walls: [] }),
  actions: {
    addWall(wall) {
      this.walls.push(wall);
    },
    clearWalls() {
      this.walls = [];
    }
  }
});