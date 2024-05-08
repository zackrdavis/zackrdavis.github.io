import { Entity } from "./entities";

export const zombieSystem = (entities: Entity[]) => {
  for (const entity of entities) {
    if (
      entity.appearance?.color === "pink" &&
      entity.collisionBox?.collisions.length
    ) {
      for (const collision of entity.collisionBox.collisions) {
        const otherEnt = entities.find(
          (ent) => ent.id === collision.otherEntId
        );

        // Turn pink entity into a zombie.
        if (otherEnt?.appearance?.color === "mediumSeaGreen") {
          entity.appearance.color = "mediumSeaGreen";
        }
      }
    }
  }
};
