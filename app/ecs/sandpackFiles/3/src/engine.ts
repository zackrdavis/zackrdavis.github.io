import { renderSystem } from "./renderSystem";
import { inputSystem } from "./inputSystem";
import { momentumSystem } from "./momentumSystem";
import { collisionSystem } from "./collisionSystem";
import { collisionLogSystem } from "./collisionLogSystem";
import { entities } from "./entities";

const systems = [
  renderSystem,
  momentumSystem,
  inputSystem,
  collisionSystem,
  collisionLogSystem,
];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 33);
