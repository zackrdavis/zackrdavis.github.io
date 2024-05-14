import { Entity } from "./entities";

export const gameOverSystem = (entities: Entity[]) => {
  let humans = 0;
  let atGoal = 0;

  for (const entity of entities) {
    // Count uninfected humans.
    if (entity.infectable) {
      humans++;
    }

    // Loop through goal's collisions to check for survivors.
    if (entity.infectable && entity.collisionBox?.collisions.length) {
      console.log(entity.collisionBox?.collisions);

      for (const collision of entity.collisionBox.collisions) {
        const otherEnt = entities.find(
          (ent) => ent.id === collision.otherEntId
        );

        // Check if the other entity is uninfected.
        if (otherEnt?.goal) {
          atGoal++;
        }
      }
    }
  }

  if (humans === 0) {
    console.log("You Lose!");
    entities.push(loseText);
  }

  if (atGoal >= 1) {
    console.log("You Win!");
    entities.push(winText);
  }
};

const winText = {
  id: "message",
  appearance: {
    color: "pink",
    width: 250,
    height: 60,
    text: "You Win!",
  },
  position: {
    x: 30,
    y: 120,
  },
};

const loseText = {
  id: "message",
  appearance: {
    color: "green",
    width: 280,
    height: 60,
    text: "You Lose!",
  },
  position: {
    x: 10,
    y: 120,
  },
};
