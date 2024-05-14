import { Entity } from "./entities";
import { forEntsWith } from "./utils";

export const collisionSystem = (entities: Entity[]) => {
  forEntsWith(["collisionBox", "position"], entities, (entity1, peers) => {
    // Reset collision events.
    entity1.collisionBox.collisions.length = 0;

    const left1 = entity1.position.x;
    const right1 = entity1.position.x + entity1.collisionBox.width;
    const top1 = entity1.position.y;
    const bottom1 = entity1.position.y + entity1.collisionBox.height;

    // Compare edges with all peers.
    for (const entity2 of peers) {
      const left2 = entity2.position.x;
      const right2 = entity2.position.x + entity2.collisionBox.width;
      const top2 = entity2.position.y;
      const bottom2 = entity2.position.y + entity2.collisionBox.height;

      let xOverlap = 0;
      let yOverlap = 0;

      if (right1 >= left2 && right2 >= right1) {
        // right1 crosses left2
        xOverlap = right1 - left2;
      } else if (right2 >= left1 && left2 <= left1) {
        // left1 crosses right2
        xOverlap = left1 - right2;
      }

      if (top1 <= bottom2 && top2 <= top1) {
        // top1 crosses bottom2
        yOverlap = top1 - bottom2;
      } else if (top2 <= bottom1 && bottom2 >= bottom1) {
        // bottom1 crosses top2
        yOverlap = bottom1 - top2;
      }

      // It's only a collision if both X and Y overlap.
      if (xOverlap && yOverlap) {
        entity1.collisionBox.collisions.push({
          otherEntId: entity2.id,
          xOverlap,
          yOverlap,
        });
      }
    }
  });
};
