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