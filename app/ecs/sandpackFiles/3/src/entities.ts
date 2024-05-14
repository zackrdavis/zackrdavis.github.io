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

// Red
const red = {
  id: "red",
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

// Green
const green = {
  id: "green",
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

const pink = {
  id: "pink",
  appearance: {
    width: 10,
    height: 70,
    color: "pink",
  },
  position: {
    x: 110,
    y: 100,
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

export const entities: Entity[] = [green, pink, red];
