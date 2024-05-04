import { Entity } from "./types";
import { renderSystem } from "./renderSystem";

// Green
const entity1 = {
  id: "#ent1",
  count: 0,
};

// Red
const entity2 = {
  id: "#ent2",
  count: 10,
  angle: 0,
};

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

const entities = [entity1, entity2];
const systems = [incrementSystem, rotateSystem, renderSystem];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 500);
