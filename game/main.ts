import * as THREE from "three";
import { createScene } from "./engine/createScene";
import { createCamera } from "./engine/createCamera";
import { createRenderer } from "./engine/createRenderer";
import { startGameLoop } from "./engine/gameLoop";
import { Player } from "./entities/Player";
import { Enemy } from "./entities/Enemy";
import { CombatSystem } from "./systems/CombatSystem";

export async function startGame(canvas: HTMLCanvasElement) {
  const scene = createScene();
  const camera = createCamera();
  const renderer = createRenderer(canvas);

  const light = new THREE.DirectionalLight("#ffffff", 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  const player = await Player.create();

  const enemy = await Enemy.create();
  scene.add(enemy.mesh);

  const combat = new CombatSystem(player, enemy);

  window.addEventListener("pointerdown", () => combat.attack());

  startGameLoop((delta) => {
    combat.update(delta);
    enemy.update(delta);
    renderer.render(scene, camera);
  });
}
