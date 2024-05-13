import { entities, Entity } from "./entities";
import { RCToEMap, getValidEntities } from "./utils";

// Render entities as HTML.
// We'll change our rendering method soon.
let canvas: HTMLCanvasElement | null;
let context: CanvasRenderingContext2D | null | undefined;

type System = {
  requiredComponents: readonly (keyof Entity)[];
  process: (this: System, map: RCToEMap) => void;
};

const renderSystem: System = {
  requiredComponents: ["appearance", "position"],

  process: function (map) {
    if (!canvas || !context) {
      // Find canvas and context.
      canvas = document.querySelector("#canvas");
      context = canvas?.getContext("2d");
    } else {
      // Clear the canvas.
      context.clearRect(0, 0, canvas.width, canvas.height);

      const entities = getValidEntities(map, this.requiredComponents);

      for (const entity of entities) {
        if (entity.position && entity.appearance && entity.velocity) {
          const { width, height, color } = entity.appearance;
          const { x, y } = entity.position;

          // Draw and fill the rect.
          context.fillStyle = color;
          context.fillRect(x, y, width, height);
        }
      }
    }
  },
};

const momentumSystem: System = {
  requiredComponents: ["position", "velocity"],

  process: function (map: RCToEMap) {
    const entities = getValidEntities(map, this.requiredComponents);

    entities.forEach((entity) => {
      console.log(entity.position);
      console.log(entity.velocity);
      console.log(entity.appearance);
    });
  },
};

class IncrementSystem {
  requiredComponents = ["position", "velocity"] as const;

  process(map: RCToEMap) {
    const entities = getValidEntities(map, this.requiredComponents);

    entities.forEach((entity) => {
      console.log(entity.position);
      console.log(entity.velocity);
      console.log(entity.appearance);
    });
  }
}

const systems = [renderSystem];

// Create a map of system requirements to entities.
const entitiesMap = new Map<readonly (keyof Entity)[], Entity[]>();
// Clear entitiesMap.
systems.forEach((system) => {
  entitiesMap.set(system.requiredComponents, []);
});

// At each tick, run all systems against all entities.
const tick = () => {
  // for each entity, add it to the map if it has the required components.
  entities.forEach((entity) => {
    for (const [requiredComponents, entities] of entitiesMap) {
      if (requiredComponents.every((c) => entity.hasOwnProperty(c))) {
        entities.push(entity);
      }
    }
  });

  for (const system of systems) {
    system.process(entitiesMap);
  }
};

// Go!
export const go = () => setInterval(tick, 33);
