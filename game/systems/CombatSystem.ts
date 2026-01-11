import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";

export class CombatSystem {
  private cooldown = 0;
  private attackInterval = 0.4;

  constructor(private player: Player, private enemy: Enemy) {}

  update(delta: number) {
    this.cooldown = Math.max(0, this.cooldown - delta);
  }

  attack() {
    if (this.cooldown > 0) return;

    const damage = calculateCriticalDamage(this.player);
    this.enemy.takeDamage(damage);
    this.cooldown = this.attackInterval;
  }
}

function calculateCriticalDamage(player: Player) {
  const isCriticalHit = Math.random() < player.critChance / 100;
  return isCriticalHit
    ? (player.critDamage / 100) * player.baseDamage
    : player.baseDamage;
}
