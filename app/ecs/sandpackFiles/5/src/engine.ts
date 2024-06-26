import { renderSystem } from "./renderSystem";
import { inputSystem } from "./inputSystem";
import { momentumSystem } from "./momentumSystem";
import { collisionSystem } from "./collisionSystem";
import { reboundSystem } from "./reboundSystem";
import { infectionSystem } from "./infectionSystem";
import { lurchSystem } from "./lurchSystem";
import { gameOverSystem } from "./gameOverSystem";
import { entities } from "./entities";

const systems = [
  renderSystem,
  inputSystem,
  momentumSystem,
  collisionSystem,
  reboundSystem,
  infectionSystem,
  lurchSystem,
  gameOverSystem,
];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 33);
