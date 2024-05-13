import { Entity } from "./entities";

let lastLog = "";

export const collisionLogSystem = (entities: Entity[]) => {
  const { collisionBox } = entities[2];

  const logText = collisionBox?.collisions?.length
    ? JSON.stringify(collisionBox.collisions, null, 2)
    : "No Collision.";

  if (logText !== lastLog) {
    document.querySelector("#log")!.innerHTML = logText;
    lastLog = logText;
  }
};
