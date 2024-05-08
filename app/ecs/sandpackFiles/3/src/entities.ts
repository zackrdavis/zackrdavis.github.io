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
    x: 160,
    y: 140,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  friction: 0.8,
};

export const entities = [entity1, entity2];
