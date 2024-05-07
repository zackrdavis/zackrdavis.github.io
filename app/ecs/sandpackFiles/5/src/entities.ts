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
    width: 20,
    height: 20,
    color: "mediumSeaGreen",
  },
  position: {
    x: 120,
    y: 140,
  },
  velocity: {
    x: 0.8,
    y: -1,
  },
  friction: 0.01,
  collisionBox: {
    width: 20,
    height: 20,
    collisions: [],
  },
};

// Green
const entity3 = {
  id: "#ent3",
  appearance: {
    width: 20,
    height: 20,
    color: "mediumSeaGreen",
  },
  position: {
    x: 200,
    y: 200,
  },
  velocity: {
    x: 0.8,
    y: -1,
  },
  friction: 0.01,
  collisionBox: {
    width: 20,
    height: 20,
    collisions: [],
  },
};

// Green
const entity4 = {
  id: "#ent4",
  appearance: {
    width: 20,
    height: 20,
    color: "mediumSeaGreen",
  },
  position: {
    x: 220,
    y: 220,
  },
  velocity: {
    x: 0.8,
    y: -1,
  },
  friction: 0.01,
  collisionBox: {
    width: 20,
    height: 20,
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
    color: "tomato",
  },
  position: {
    // x: 160,
    // y: 140,
    x: 260,
    y: 220,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  friction: 0.05,
  collisionBox: {
    width: 20,
    height: 20,
    collisions: [],
  },
};

const wallTop = {
  id: "wallTop",
  appearance: {
    width: 280,
    height: 10,
    color: "gray",
  },
  position: {
    x: 10,
    y: 0,
  },
  collisionBox: {
    width: 280,
    height: 10,
    collisions: [],
  },
};

const wallBottom = {
  id: "wallBottom",
  appearance: {
    width: 280,
    height: 10,
    color: "gray",
  },
  position: {
    x: 10,
    y: 290,
  },
  collisionBox: {
    width: 280,
    height: 10,
    collisions: [],
  },
};

const wallLeft = {
  id: "wallLeft",
  appearance: {
    width: 10,
    height: 280,
    color: "gray",
  },
  position: {
    x: 0,
    y: 10,
  },
  collisionBox: {
    width: 10,
    height: 280,
    collisions: [],
  },
};

const wallRight = {
  id: "wallRight",
  appearance: {
    width: 10,
    height: 280,
    color: "gray",
  },
  position: {
    x: 290,
    y: 10,
  },
  collisionBox: {
    width: 10,
    height: 280,
    collisions: [],
  },
};

export const entities = [
  entity1,
  entity2,

  entity3,
  entity4,

  wallTop,
  wallBottom,
  wallLeft,
  wallRight,
];
