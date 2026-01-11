import * as THREE from "three";
import gsap from "gsap";
import { loadAssetsGLB } from "../lib/generalFunctions";
import { IdleSystem } from "../systems/IdleSystem";

export class Enemy {
  mesh: THREE.Group;
  hp = 100;

  private mixer: THREE.AnimationMixer;
  private actions: Record<string, THREE.AnimationAction> = {};
  private idle: IdleSystem;

  private constructor(model: THREE.Group, animations: THREE.AnimationClip[]) {
    this.mesh = model;
    this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.y = Math.PI;

    this.mixer = new THREE.AnimationMixer(this.mesh);

    animations.forEach((clip) => {
      this.actions[clip.name.trim()] = this.mixer.clipAction(clip);
    });

    this.idle = new IdleSystem(this.mixer, this.actions, {
      base: "Idle 01",
      variations: [
        "Jump 01",
        "Combo Attack 01",
        "Taunt 01",
        "Taunt 02",
        "Taunt 03",
        "Taunt 04",
      ],
    });

    this.idle.start();
  }

  static async create() {
    const { model, animations } = await loadAssetsGLB({
      url: "/assets/models/enemy.glb",
      scalar: 0.05,
      isRotateY: true,
    });

    return new Enemy(model, animations);
  }

  update(delta: number) {
    this.idle.update(delta);
    this.mixer?.update(delta);

    this.mesh.position.y = Math.sin(performance.now() * 0.002) * 0.02;
  }

  takeDamage(dmg: number) {
    this.hp = Math.max(0, this.hp - dmg);
    this.hitFeedback();

    this.playOnce("Hit");
  }

  private playOnce(name: string) {
    const action = this.actions[name];
    if (!action) return;

    this.idle.stop();

    action.reset().setLoop(THREE.LoopOnce, 1).clampWhenFinished = true;

    action.play();

    setTimeout(() => {
      this.idle.start();
    }, action.getClip().duration * 1000);
  }

  private hitFeedback() {
    gsap.to(this.mesh.position, {
      x: "+=0.05",
      duration: 0.05,
      yoyo: true,
      repeat: 2,
    });
  }
}
