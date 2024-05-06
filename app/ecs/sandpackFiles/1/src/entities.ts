export type Entity = {
  // Mandatory
  id: string;

  // Optional Components
  count?: number;
  angle?: number;
};

// Green
const entity1 = {
  id: "#ent1",
  count: 0,
};

// Red
const entity2 = {
  id: "#ent2",
  count: 10,
  angle: 0,
};

export const entities = [entity1, entity2];
