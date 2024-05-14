import { entities } from "./entities";
import { renderSystem } from "./renderSystem";
import { momentumSystem } from "./momentumSystem";
import { inputSystem } from "./inputSystem";

const systems = [momentumSystem, renderSystem, inputSystem];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 33);
