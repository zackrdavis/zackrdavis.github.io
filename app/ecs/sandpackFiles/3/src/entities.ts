type Collision = {
  otherEntId: string;
  xOverlap: number;
  yOverlap: number;
};

export type Entity = {
  // Mandatory
  id: string;

  // Optional Components
  playerControl?: boolean;
  appearance?: {
    color: string;
    width: number;
    height: number;
  };
  position?: {
    x: number;
    y: number;
  };
  velocity?: {
    x: number;
    y: number;
  };
  friction?: number;
  collisionBox?: {
    width: number;
    height: number;
    collisions: Collision[];
  };
};

// Green
const entity1 = {
  id: "#ent1",
  appearance: {
    width: 50,
    height: 50,
    color: "mediumSeaGreen",
  },
  position: {
    x: 120,
    y: 50,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  friction: 0.01,
  collisionBox: {
    width: 50,
    height: 50,
    collisions: [],
  },
};

// Red
const entity2 = {
  id: "#ent2",
  playerControl: true,
  appearance: {
    width: 20,
    height: 20,
    color: "rgba(255, 0, 0, 0.5)",
  },
  position: {
    x: 160,
    y: 140,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  friction: 0.8,
  collisionBox: {
    width: 20,
    height: 20,
    collisions: [],
  },
};

const entity3 = {
  id: "#ent3",
  appearance: {
    width: 10,
    height: 70,
    color: "gray",
  },
  position: {
    x: 50,
    y: 140,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  friction: 0.01,
  collisionBox: {
    width: 10,
    height: 70,
    collisions: [],
  },
};

export const entities: Entity[] = [entity1, entity3, entity2];
