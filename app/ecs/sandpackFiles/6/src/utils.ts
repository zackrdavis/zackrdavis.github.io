import { Entity } from "./entities";

// Loop through all entities to find those with the needed components.
// Run the callback on each one, providing as arguments the current entity and its peers.
export const forEntsWith = <C extends (keyof Entity)[]>(
  components: C,
  entities: Entity[],
  callback: (
    entity: Pick<Required<Entity>, C[number]> & Entity,
    peers: (Pick<Required<Entity>, C[number]> & Entity)[]
  ) => void
) => {
  const filtered = entities.filter((ent) =>
    components.every((comp) => Object.keys(ent).includes(comp))
  ) as (Pick<Required<Entity>, C[number]> & Entity)[];

  for (let i = 0; i < filtered.length; i++) {
    const entity = filtered[i];
    const peers = [...filtered.slice(0, i), ...filtered.slice(i + 1)];

    callback(entity, peers);
  }
};

// Generate a moveable square entity with some defaults.
export const makeSquare = (opts: {
  role: "player" | "zombie" | "civilian";
  x: number;
  y: number;
  id?: string;
  width?: number;
  height?: number;
  vx?: number;
  vy?: number;
  friction?: number;
}) =>
  ({
    id: opts.id || crypto.randomUUID(),
    appearance: {
      width: opts.width || 20,
      height: opts.height || 20,
      color:
        opts.role === "zombie"
          ? "mediumSeaGreen"
          : opts.role === "civilian"
          ? "pink"
          : "tomato",
    },
    position: {
      x: opts.x,
      y: opts.y,
    },
    velocity: {
      x: opts.vx || 0,
      y: opts.vy || 0,
    },
    collisionBox: {
      width: opts.width || 20,
      height: opts.height || 20,
      collisions: [],
    },
    rigidBody: {
      stuck: false,
    },
    playerControl: opts.role === "player",
    friction: opts.role === "player" ? 0.8 : 0.01,
    infectable: opts.role === "civilian",
    infectious: opts.role === "zombie",
  } as Entity);

export const makeWall = (opts: {
  orientation: "x" | "y";
  length: number;
  thickness: number;
  x: number;
  y: number;
  id?: string;
}) => {
  const width = opts.orientation === "x" ? opts.length : opts.thickness;
  const height = opts.orientation === "y" ? opts.length : opts.thickness;

  return {
    id: opts.id || crypto.randomUUID(),
    appearance: {
      width,
      height,
      color: "gray",
    },
    position: {
      x: opts.x,
      y: opts.y,
    },
    collisionBox: {
      width,
      height,
      collisions: [],
    },
    rigidBody: {
      stuck: true,
    },
  };
};
