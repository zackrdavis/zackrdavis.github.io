import { Entity } from "./entities";

export const collisionLogSystem = (entities: Entity[]) => {
  const { collisionBox } = entities[1];
  if (collisionBox?.collisionEvents?.length) {
    document.querySelector(
      "#log"
    )!.innerHTML = `xOverlap: ${collisionBox.collisionEvents[0].xOverlap},
yOverlap: ${collisionBox.collisionEvents[0].yOverlap}
`;
  } else {
    document.querySelector("#log")!.innerHTML = "No Collision.";
  }
};
