import { entities, Entity } from "./entities";
import { renderSystem } from "./renderSystem";

// Process entities with a count component.
const incrementSystem = (entities: Entity[]) => {
  for (const entity of entities) {
    if (entity.count !== undefined) {
      entity.count += 1;
    }
  }
};

// Process entities with an angle component.
const rotateSystem = (entities: Entity[]) => {
  for (const entity of entities) {
    if (entity.angle !== undefined) {
      entity.angle += 6;
    }
  }
};

const systems = [incrementSystem, rotateSystem, renderSystem];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 500);
