export type Entity = {
  // Mandatory
  id: string;

  // Optional Components
  appearance?: {
    color: string;
    width: number;
    height: number;
  };
  location?: {
    x: number;
    y: number;
  };
  playerControl?: boolean;
};
