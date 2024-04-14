import { Ent, forEntsWith } from "./shared";

const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

type ControlMap = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export class PlayerControlSystem {
  controls: ControlMap = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  setControl(control: keyof ControlMap, value: boolean) {
    this.controls[control] = value;
  }

  update(entities: Ent[]) {
    forEntsWith(["velocity", "playerControl"], entities, (entity) => {
      const { up, down, left, right } = this.controls;

      const { acceleration, maxSpeed } = entity.playerControl;

      if ((right || left || down || up) && !entity.collisionEvent) {
        // accelerate up to maxSpeed
        const { x, y } = entity.velocity;

        const newXVel = x + (right ? acceleration : left ? -acceleration : 0);
        const newYVel = y + (down ? acceleration : up ? -acceleration : 0);

        entity.velocity = {
          x: clamp(newXVel, -maxSpeed, maxSpeed),
          y: clamp(newYVel, -maxSpeed, maxSpeed),
        };
      }
    });
  }
}
