import { Entity } from "./types";

export class InputSystem {
  keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
  };

  constructor() {
    window.addEventListener("keydown", (e) => {
      const pressedKey = e.key as keyof typeof this.keys;

      if (pressedKey in this.keys) {
        this.keys[pressedKey] = true;
      }

      e.preventDefault();
    });

    window.addEventListener("keyup", (e) => {
      const pressedKey = e.key as keyof typeof this.keys;

      if (pressedKey in this.keys) {
        this.keys[pressedKey] = false;
      }

      e.preventDefault();
    });
  }

  update(entities: Entity[]) {
    for (const entity of entities) {
      if (entity.location && entity.playerControl) {
        const { x, y } = entity.location;

        const { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, w, a, s, d } =
          this.keys;

        const right = ArrowRight || d;
        const left = ArrowLeft || a;
        const up = ArrowUp || w;
        const down = ArrowDown || s;

        const speed = 10;

        if (right || left || down || up) {
          const newX = x + (right ? speed : left ? -speed : 0);
          const newY = y + (down ? speed : up ? -speed : 0);

          entity.location = {
            x: newX,
            y: newY,
          };
        }
      }
    }
  }
}
