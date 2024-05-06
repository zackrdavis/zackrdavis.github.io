import { entities } from "./entities";
import { renderSystem } from "./renderSystem";
import { inputSystem } from "./inputSystem";

const systems = [inputSystem, renderSystem];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 33);
