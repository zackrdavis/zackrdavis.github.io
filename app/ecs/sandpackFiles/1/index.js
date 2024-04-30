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
const incrementSystem = (entities) => {
  for (const entity of entities.filter((e) => e.count !== undefined)) {
    if (entity.count !== undefined) {
      entity.count += 1;
    }
  }
};

// Process entities with an angle component.
const rotateSystem = (entities) => {
  for (const entity of entities) {
    if (entity.angle !== undefined) {
      entity.angle += 6;
    }
  }
};

const entities = [entity1, entity2];
const systems = [incrementSystem, rotateSystem];

// At each tick, run all systems.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

setInterval(tick, 500);
