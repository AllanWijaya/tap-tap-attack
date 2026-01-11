export function startGameLoop(update: (delta: number) => void) {
  let last = performance.now();

  function loop(now: number) {
    const delta = (now - last) / 1000;
    last = now;

    update(delta);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
