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
  rigidBody?: {
    stuck: boolean;
  };
};

// Red
const red = {
  id: "red",
  playerControl: true,
  appearance: {
    width: 20,
    height: 20,
    color: "tomato",
  },
  position: {
    x: 260,
    y: 220,
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
  rigidBody: {
    stuck: false,
  },
};

// Green
const green = {
  id: "green",
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
  rigidBody: {
    stuck: false,
  },
};

const wallTop = {
  id: "wallTop",
  appearance: {
    width: 280,
    height: 20,
    color: "gray",
  },
  position: {
    x: 10,
    y: -10,
  },
  collisionBox: {
    width: 280,
    height: 20,
    collisions: [],
  },
  rigidBody: {
    stuck: true,
  },
};

const wallBottom = {
  id: "wallBottom",
  appearance: {
    width: 280,
    height: 20,
    color: "gray",
  },
  position: {
    x: 10,
    y: 290,
  },
  collisionBox: {
    width: 280,
    height: 20,
    collisions: [],
  },
  rigidBody: {
    stuck: true,
  },
};

const wallLeft = {
  id: "wallLeft",
  appearance: {
    width: 20,
    height: 280,
    color: "gray",
  },
  position: {
    x: -10,
    y: 10,
  },
  collisionBox: {
    width: 20,
    height: 280,
    collisions: [],
  },
  rigidBody: {
    stuck: true,
  },
};

const wallRight = {
  id: "wallRight",
  appearance: {
    width: 20,
    height: 280,
    color: "gray",
  },
  position: {
    x: 290,
    y: 10,
  },
  collisionBox: {
    width: 20,
    height: 280,
    collisions: [],
  },
  rigidBody: {
    stuck: true,
  },
};

const middleWall = {
  id: "middleWall",
  appearance: {
    width: 10,
    height: 50,
    color: "gray",
  },
  position: {
    x: 150,
    y: 50,
  },
  collisionBox: {
    width: 10,
    height: 50,
    collisions: [],
  },
  rigidBody: {
    stuck: true,
  },
};

export const entities = [
  green,
  red,
  wallTop,
  wallBottom,
  wallLeft,
  wallRight,
  middleWall,
];
