// import { Entity } from "./entities";

// export const gameOverSystem = (entities: Entity[]) => {
//   let humans = 0;

//   for (const entity of entities) {
//     // Count the survivors.
//     if (entity.infectable) {
//       humans++;
//     }

//     // Loop through goal's collisions to check for survivors.
//     if (entity.goal && entity.collisionBox?.collisions.length) {
//       for (const collision of entity.collisionBox.collisions) {
//         const otherEnt = entities.find(
//           (ent) => ent.id === collision.otherEntId
//         );

//         // Check if the player has collided with a zombie.
//         if (otherEnt?.infectable) {
//           console.log("Game Over");
//           return;
//         }
//       }
//     }
//   }
// };

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
