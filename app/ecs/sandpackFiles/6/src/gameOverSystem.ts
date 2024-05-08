import { Entity } from "./entities";

export const gameOverSystem = (entities: Entity[]) => {
  let humans = 0;

  for (const entity of entities) {
    // Count the survivors.
    if (entity.appearance?.color === "pink") {
      humans++;
    }

    if (entity.appearance?.color === "yellow" && entity.collisionBox) {
      const { collisions } = entity.collisionBox;

      for (const collision of collisions) {
        const otherEnt = entities.find(
          (ent) => ent.id === collision.otherEntId
        );

        // Check if the player has collided with a zombie.
        if (otherEnt?.appearance?.color === "pink") {
          console.log("Game Over");
          return;
        }
      }
    }
  }
};
