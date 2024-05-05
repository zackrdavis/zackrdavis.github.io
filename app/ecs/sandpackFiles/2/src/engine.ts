import { Entity } from "./types";
import { RenderSystem } from "./renderSystem";
import { InputSystem } from "./inputSystem";

// Green
const entity1 = {
  id: "#ent1",
  appearance: {
    width: 20,
    height: 20,
    color: "mediumSeaGreen",
  },
  location: {
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
  location: {
    x: 160,
    y: 140,
  },
  playerControl: true,
};

const inputSystem = new InputSystem();
const renderSystem = new RenderSystem();
const updateRenderSystem = (entities) => renderSystem.update(entities);
const updateInputSystem = (entities) => inputSystem.update(entities);

const entities = [entity1, entity2];
const systems = [
  (entities) => inputSystem.update(entities),
  (entities) => renderSystem.update(entities),
];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 30);
