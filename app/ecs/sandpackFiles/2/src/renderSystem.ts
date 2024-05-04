import { Entity } from "./types";

// Draw entities with appearance and location to the canvas.
export const renderSystem = (entities: Entity[]) => {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
  const context = canvas.getContext("2d")!;

  // clear canvas for redraw
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (const entity of entities) {
    if (entity.appearance && entity.location) {
      const { width, height, color } = entity.appearance;
      const { x, y } = entity.location;

      // draw and fill the rect
      context.fillStyle = color;
      context.fillRect(x, y, width, height);
    }
  }
};
