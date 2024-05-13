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
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0.2,
    y: 0.2,
  },
};

// Green
const green: Entity = {
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
    x: -0.4,
    y: 0.4,
  },
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

export const entities = [red, green, pink];
