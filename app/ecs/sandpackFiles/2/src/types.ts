export type Entity = {
  // All entities have an id.
  id: string;

  // Entities may or may not have any of these components.
  appearance?: {
    color: string;
    width: number;
    height: number;
  };
  location?: {
    x: number;
    y: number;
  };
};
