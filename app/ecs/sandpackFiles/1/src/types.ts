export type Entity = {
  // All entities have an id.
  id: string;

  // Entities may or may not have any of these components.
  count?: number;
  angle?: number;
};
