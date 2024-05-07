import { Entity } from "./entities";

type Update = {
  entity: Entity;
  newVelX: number;
  newVelY: number;
  newPosX: number;
  newPosY: number;
};

const updates: Update[] = [];

export const reboundSystem = (entities: Entity[]) => {
  // Loop through all entities with velocity and collisions.
  for (const entity of entities) {
    if (
      entity.velocity &&
      entity.position &&
      entity.collisionBox?.collisions?.length
    ) {
      // Get current entity's velocity.
      let { x: vx1, y: vy1 } = entity.velocity;
      let { x: px1, y: py1 } = entity.position;

      // Loop through all collisions on a single entity.
      // These will alter the entity's velocity cumulatively.
      for (const collision of entity.collisionBox.collisions) {
        const { otherEntId, xOverlap, yOverlap } = collision;

        // Get the collision axis.
        const xCollision = Math.abs(yOverlap) > Math.abs(xOverlap);
        const yCollision = Math.abs(xOverlap) > Math.abs(yOverlap);
        const cornerCollision = Math.abs(xOverlap) === Math.abs(yOverlap);

        // Get the other entity.
        const otherEntity = entities.find((ent) => ent.id === otherEntId);

        // Determine 'immovable' status.
        // Should 'immovable' be an explicit component?
        const otherImmovable = otherEntity?.velocity === undefined;

        // Get the other entity's velocity.
        const { x: vx2, y: vy2 } = otherEntity?.velocity || { x: 0, y: 0 };

        // Add to new velocities.
        if (cornerCollision) {
          vx1 = otherImmovable
            ? -vx1 // Bounce off immovable entity.
            : vx2; // Use velocity from movable entity.
          vy1 = otherImmovable
            ? -vy1 // Bounce off immovable entity.
            : vy2; // Use velocity from movable entity.
        } else if (xCollision) {
          vx1 = otherImmovable
            ? -vx1 // Bounce off immovable entity.
            : vx2; // Use velocity from movable entity.
          vy1 = vy1;
        } else if (yCollision) {
          vy1 = otherImmovable
            ? -vy1 // Bounce off immovable entity.
            : vy2; // Use velocity from movable entity.
          vx1 = vx1;
        }

        // Adjust position to cancel overlap
        if (cornerCollision) {
          px1 -= xOverlap;
          py1 -= yOverlap;
        } else if (xCollision) {
          px1 -= xOverlap;
          py1 = py1;
        } else if (yCollision) {
          px1 = px1;
          py1 -= yOverlap;
        }
      }

      // Push to updates list.
      updates.push({
        entity,
        newVelX: vx1,
        newVelY: vy1,
        newPosX: px1,
        newPosY: py1,
      });
    }
  }

  updates.forEach(({ entity, newVelX, newVelY, newPosX, newPosY }) => {
    // Apply new velocity and position.
    if (entity.velocity && entity.position) {
      entity.velocity.x = newVelX;
      entity.velocity.y = newVelY;
      entity.position.x = newPosX;
      entity.position.y = newPosY;
    }
  });

  updates.length = 0;
};
