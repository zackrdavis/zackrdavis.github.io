import { renderSystem } from "./renderSystem";
import { inputSystem } from "./inputSystem";
import { momentumSystem } from "./momentumSystem";
import { collisionSystem } from "./collisionSystem";
import { reboundSystem } from "./reboundSystem";
import { zombieSystem } from "./zombieSystem";
import { lurchSystem } from "./lurchSystem";
import { gameOverSystem } from "./gameOverSystem";
import { entities } from "./entities";

const systems = [
  inputSystem,
  renderSystem,
  reboundSystem,
  momentumSystem,
  collisionSystem,
  zombieSystem,
  lurchSystem,
  gameOverSystem,
  // collisionLogSystem,
];

// At each tick, run all systems against all entities.
const tick = () => {
  for (const system of systems) {
    system(entities);
  }
};

// Go!
export const go = () => setInterval(tick, 33);