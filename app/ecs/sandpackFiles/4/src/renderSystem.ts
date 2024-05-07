import { Entity } from "./entities";

let canvas: HTMLCanvasElement | null;
let context: CanvasRenderingContext2D | null | undefined;

export const renderSystem = (entities: Entity[]) => {
  if (!canvas || !context) {
    // Find canvas and context.
    canvas = document.querySelector("#canvas");
    context = canvas?.getContext("2d");
  } else {
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
  }
};
