export type Entity = {
  // Mandatory
  id: string;

  // Optional Components
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
  playerControl?: boolean;
};

// Red
const red = {
  id: "red",
  appearance: {
    width: 20,
    height: 20,
    color: "tomato",
  },
  position: {
    x: 100,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  friction: 0.8,
  playerControl: true,
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
    x: 300,
    y: 0,
  },
  velocity: {
    x: -2,
    y: 2,
  },
  friction: 0.01,
};

// Pink
const pink = {
  id: "pink",
  appearance: {
    width: 20,
    height: 20,
    color: "pink",
  },
  position: {
    x: 150,
    y: 150,
  },
};

export const entities: Entity[] = [red, green, pink];
