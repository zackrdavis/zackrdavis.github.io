import { Entity } from "./entities";

const momentumSystem = (entities: Entity[]) => {
  for (const entity of entities) {
    if (entity.position && entity.velocity) {
      // Apply the velocity to the position.
      entity.position.x += entity.velocity.x;
      entity.position.y += entity.velocity.y;
    }
  }
};

const renderSystem = (entities: Entity[]) => {
  const canvas = document.querySelector("canvas")!;
  const context = canvas?.getContext("2d")!;

  // Clear the canvas.
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (const entity of entities) {
    if (entity.position && entity.appearance) {
      const { width, height, color } = entity.appearance;
      const { x, y } = entity.position;

      // Draw and fill the rect.
      context.fillStyle = color;
      context.fillRect(x, y, width, height);
    }
  }
};

export const systems = [momentumSystem, renderSystem];
