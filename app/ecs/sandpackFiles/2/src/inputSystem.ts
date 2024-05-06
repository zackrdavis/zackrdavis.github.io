import { Entity } from "./types";

const speed = 10;

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
    // Determine position change.
    const changePosX = bothX ? 0 : right ? speed : left ? -speed : 0;
    const changePosY = bothY ? 0 : down ? speed : up ? -speed : 0;

    for (const entity of entities) {
      if (entity.position && entity.playerControl) {
        // Move playerControl entities.
        entity.position = {
          x: entity.position.x + changePosX,
          y: entity.position.y + changePosY,
        };
      }
    }
  }
};
