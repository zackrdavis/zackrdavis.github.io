import { renderSystem } from "./renderSystem";
import { inputSystem } from "./inputSystem";

// Green
const entity1 = {
  id: "#ent1",
  appearance: {
    width: 20,
    height: 20,
    color: "mediumSeaGreen",
  },
  position: {
    x: 120,
    y: 140,
  },
};

// Red
const entity2 = {
  id: "#ent2",
  appearance: {
    width: 20,
    height: 20,
    color: "tomato",
  },
  position: {
    x: 160,
    y: 140,
  },
  playerControl: true,
};

const entities = [entity1, entity2];
const systems = [inputSystem, renderSystem];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 30);
