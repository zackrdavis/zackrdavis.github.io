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

  // What direction is being pressed?
  const right = pressedKeys.ArrowRight || pressedKeys.d;
  const left = pressedKeys.ArrowLeft || pressedKeys.a;
  const up = pressedKeys.ArrowUp || pressedKeys.w;
  const down = pressedKeys.ArrowDown || pressedKeys.s;

  if (right || left || down || up) {
    const changeX = right ? speed : left ? -speed : 0;
    const changeY = down ? speed : up ? -speed : 0;

    for (const entity of entities) {
      if (entity.position && entity.playerControl) {
        // Move playerControl entities.
        entity.position = {
          x: entity.position.x + changeX,
          y: entity.position.y + changeY,
        };
      }
    }
  }
};
