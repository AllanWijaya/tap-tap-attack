import * as THREE from "three";
import { loadAssetsGLB } from "../lib/generalFunctions";

export class Player {
  mesh: THREE.Group;
  hp = 100;
  baseDamage = 10;
  critChance = 50;
  critDamage = 100;

  private mixer?: THREE.AnimationMixer;
  private actions: Record<string, THREE.AnimationAction> = {};
  private activeAction?: THREE.AnimationAction;

  constructor(model: THREE.Group, animations: THREE.AnimationClip[] = []) {
    this.mesh = model;

    this.mesh.position.set(-1.5, 0, 0);

    // FIX ARAH MODEL (optional tapi umum)
    this.mesh.rotation.y = Math.PI;

    // INIT ANIMATION
    if (animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.mesh);

      animations.forEach((clip) => {
        this.actions[clip.name] = this.mixer!.clipAction(clip);
      });

      // PLAY DEFAULT (Idle / anim pertama)
      const idle =
        this.actions["Idle"] ??
        this.actions["idle"] ??
        this.actions[animations[0].name];

      idle?.play();
      this.activeAction = idle;
    }
  }

  static async create() {
    const { model, animations } = await loadAssetsGLB({
      url: "/assets/models/enemy.glb",
      scalar: 0.05,
      isRotateY: true,
    });

    return new Player(model, animations);
  }
}
