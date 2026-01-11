import * as THREE from "three";

interface IdleConfig {
  base: string; // "Idle"
  variations?: string[]; // ["Idle_Look", "Idle_Down"]
  minDelay?: number; // ms
  maxDelay?: number; // ms
}

export class IdleSystem {
  private mixer: THREE.AnimationMixer;
  private actions: Record<string, THREE.AnimationAction>;
  private active?: THREE.AnimationAction;
  private config: IdleConfig;
  private running = false;

  constructor(
    mixer: THREE.AnimationMixer,
    actions: Record<string, THREE.AnimationAction>,
    config: IdleConfig
  ) {
    this.mixer = mixer;
    this.actions = actions;
    this.config = {
      minDelay: 3000,
      maxDelay: 6000,
      ...config,
    };
  }

  start() {
    this.running = true;
    this.play(this.config.base, true);
    this.scheduleVariation();
  }

  stop() {
    this.running = false;
  }

  update(delta: number) {
    this.mixer.update(delta);
  }

  private play(name: string, loop = false) {
    const action = this.actions[name];
    if (!action) {
      console.warn("Animation not found:", name);
      return;
    }

    action.reset();
    action.fadeIn(0.3);

    if (loop) {
      action.setLoop(THREE.LoopRepeat, Infinity);
    } else {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }

    action.play();

    this.active?.fadeOut(0.3);
    this.active = action;
  }

  private scheduleVariation() {
    if (!this.running || !this.config.variations?.length) return;

    const delay = THREE.MathUtils.randInt(
      this.config.minDelay!,
      this.config.maxDelay!
    );

    setTimeout(() => {
      if (!this.running) return;

      const pick =
        this.config.variations![
          Math.floor(Math.random() * this.config.variations!.length)
        ];

      this.play(pick);

      // balik ke base idle
      setTimeout(() => {
        if (this.running) {
          this.play(this.config.base, true);
        }
      }, 1200);

      this.scheduleVariation();
    }, delay);
  }
}
