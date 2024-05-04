import { Entity } from "./types";

// Render entities as HTML.
// We'll change our rendering method soon.
export const renderSystem = (entities: Entity[]) => {
  for (const entity of entities) {
    // Write the count.
    document.querySelector<HTMLElement>(entity.id)!.innerHTML = String(
      entity.count
    );

    // Apply rotation style.
    document.querySelector<HTMLElement>(
      entity.id
    )!.style.transform = `rotate(${entity.angle}deg)`;
  }
};
