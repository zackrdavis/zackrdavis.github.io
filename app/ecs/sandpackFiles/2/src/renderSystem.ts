import { Entity } from "./types";

export class RenderSystem {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null | undefined;

  constructor() {
    this.canvas = document.querySelector("#canvas");
    this.context = this.canvas?.getContext("2d");
  }

  update(entities: Entity[]) {
    // do nothing if no canvas
    if (!this.canvas || !this.context) {
      return;
    }

    const ctx = this.context;

    // clear canvas for redraw
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const entity of entities) {
      if (entity.location && entity.appearance) {
        const { width, height, color } = entity.appearance;
        const { x, y } = entity.location;

        // draw and fill the rect
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
      }
    }
  }
}
