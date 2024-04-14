"use client";

import { useEffect, useRef } from "react";
import { DemoBlock } from "./DemoBlock";
import { gameEntities } from "./ecs-src/setup";
import { CollisionSystem } from "./ecs-src/systems/collision";
import { FrictionSystem } from "./ecs-src/systems/friction";
import { ImpactSystem } from "./ecs-src/systems/impact";
import { MomentumSystem } from "./ecs-src/systems/momentum";
import { PlayerControlSystem } from "./ecs-src/systems/playerControl";
import { ResetCollisions } from "./ecs-src/systems/resetCollisions";
import { ZombieVirus } from "./ecs-src/systems/zombieVirus";

const controlFromEvent: (e: KeyboardEvent) => keyof ControlMap | null = (e) => {
  return ["w", "W", "ArrowUp"].includes(e.key)
    ? "up"
    : ["s", "S", "ArrowDown"].includes(e.key)
    ? "down"
    : ["a", "A", "ArrowLeft"].includes(e.key)
    ? "left"
    : ["d", "D", "ArrowRight"].includes(e.key)
    ? "right"
    : null;
};

type ControlMap = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export default function Ecs() {
  const controlSystemRef = useRef(new PlayerControlSystem());

  const handleKeyDown = (e: KeyboardEvent) => {
    const control = controlFromEvent(e);
    control && controlSystemRef.current.setControl(control, true);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const control = controlFromEvent(e);
    control && controlSystemRef.current.setControl(control, false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <DemoBlock
        entities={structuredClone(gameEntities)}
        systems={[
          new MomentumSystem(),
          new CollisionSystem(),
          new ImpactSystem(),
          controlSystemRef.current,
          new FrictionSystem(),
          new ZombieVirus(),
          new ResetCollisions(),
        ]}
      />
      <DemoBlock
        entities={structuredClone(gameEntities)}
        systems={[
          new MomentumSystem(),
          new CollisionSystem(),
          new ImpactSystem(),
          controlSystemRef.current,
          new FrictionSystem(),
          new ZombieVirus(),
          new ResetCollisions(),
        ]}
      />
      <DemoBlock
        entities={structuredClone(gameEntities)}
        systems={[
          new MomentumSystem(),
          new CollisionSystem(),
          new ImpactSystem(),
          controlSystemRef.current,
          new FrictionSystem(),
          new ZombieVirus(),
          new ResetCollisions(),
        ]}
      />
    </>
  );
}
