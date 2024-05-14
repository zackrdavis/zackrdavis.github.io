import { Entity } from "./entities";

// Loop through all entities to find those with the needed components.
// Run the callback on each one, providing as arguments the current entity and its peers.
export const forEntsWith = <C extends (keyof Entity)[]>(
  components: C,
  entities: Entity[],
  callback: (
    entity: Pick<Required<Entity>, C[number]> & Entity,
    peers: (Pick<Required<Entity>, C[number]> & Entity)[]
  ) => void
) => {
  const filtered = entities.filter((ent) =>
    components.every((comp) => Object.keys(ent).includes(comp))
  ) as (Pick<Required<Entity>, C[number]> & Entity)[];

  for (let i = 0; i < filtered.length; i++) {
    const entity = filtered[i];
    const peers = [...filtered.slice(0, i), ...filtered.slice(i + 1)];

    callback(entity, peers);
  }
};
