import { Entity } from "./entities";

export const momentumSystem = (entities: Entity[]) => {
  for (const entity of entities) {
    if (entity.position && entity.velocity) {
      // Apply the velocity to the position.
      entity.position.x += entity.velocity.x;
      entity.position.y += entity.velocity.y;
    }
  }
};
