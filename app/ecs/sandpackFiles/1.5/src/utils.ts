import { Entity } from "./entities";

// Required-Components to Entities map.
export type RCToEMap = Map<readonly (keyof Entity)[], Entity[]>;

export const getValidEntities = <RC extends readonly (keyof Entity)[]>(
  map: RCToEMap,
  requiredComponents: RC
) => {
  // Get the entities that have all the required components.
  // Widen type to unknown to allow casting.
  const entities = (map.get(requiredComponents) || []) as unknown;
  // Return as Entity with *exactly* the required components.
  // This will warn us if we try to access undeclared components.
  return entities as Required<Pick<Entity, RC[number]>>[];
};
