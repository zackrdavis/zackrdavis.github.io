import { Entity } from "./entities";

const maxSpeed = 5;
const accel = 2;

const pressedKeys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
  W: false,
  A: false,
  S: false,
  D: false,
};

let listenerSet = false;

// Minmax helper.
const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

export const inputSystem = (entities: Entity[]) => {
  if (!listenerSet) {
    // Setup keyboard listeners.
    window.addEventListener("keydown", (e) => {
      if (e.key in pressedKeys) pressedKeys[e.key] = true;
      e.preventDefault();
    });

    window.addEventListener("keyup", (e) => {
      if (e.key in pressedKeys) pressedKeys[e.key] = false;
      e.preventDefault();
    });

    listenerSet = true;
  }

  const { ArrowUp, ArrowLeft, ArrowDown, ArrowRight, w, a, s, d, W, A, S, D } =
    pressedKeys;

  // What direction is being pressed?
  const up = ArrowUp || w || W;
  const left = ArrowLeft || a || A;
  const down = ArrowDown || s || S;
  const right = ArrowRight || d || D;

  // Opposite directions cancel out the axis.
  const bothX = left && right;
  const bothY = up && down;

  if (right || left || down || up) {
    // Determine velocity change.
    const changeVelX = bothX ? 0 : right ? accel : left ? -accel : 0;
    const changeVelY = bothY ? 0 : down ? accel : up ? -accel : 0;

    for (const entity of entities) {
      if (
        entity.velocity &&
        entity.playerControl
        // // block controls on colliding entities
        // entity.collisionBox?.collisions.length === 0
      ) {
        const { x, y } = entity.velocity;

        // Determine the change in velocity.
        const newVelX = clamp(x + changeVelX, -maxSpeed, maxSpeed);
        const newVelY = clamp(y + changeVelY, -maxSpeed, maxSpeed);

        entity.velocity = {
          x: newVelX,
          y: newVelY,
        };
      }
    }
  }
};
