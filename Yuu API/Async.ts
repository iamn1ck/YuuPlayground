

export const Async = {
  setTimeout: Godot.async.setTimeout,
  setInterval: Godot.async.setInterval,
  clearTimer: Godot.async.clearTimer,
  wait,
}


async function wait(durMs: number): Promise<void> {
  return new Promise((resolve) => {
    Async.setTimeout(() => { resolve(); }, durMs);
  });
}