import { Entity } from "./types";
import { renderSystem } from "./renderSystem";

// Green
const entity1 = {
  id: "#ent1",
  appearance: {
    width: 10,
    height: 10,
    color: "mediumSeaGreen",
  },
  location: {
    x: 10,
    y: 10,
  },
};

// Red
const entity2 = {
  id: "#ent2",
  appearance: {
    width: 10,
    height: 10,
    color: "tomato",
  },
  location: {
    x: 45,
    y: 45,
  },
};

const entities = [entity1, entity2];
const systems = [renderSystem];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 500);
