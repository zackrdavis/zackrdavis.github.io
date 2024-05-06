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
  playerControl?: boolean;
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
};

// Red
const entity2 = {
  id: "#ent2",
  appearance: {
    width: 20,
    height: 20,
    color: "tomato",
  },
  position: {
    x: 160,
    y: 140,
  },
  playerControl: true,
};

export const entities = [entity1, entity2];
