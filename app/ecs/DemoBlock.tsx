import { useCallback, useEffect, useRef, useState } from "react";
import { useInterval } from "../../helpers/useInterval";
import style from "./demoBlock.module.css";
import { DisplaySystem } from "./ecs-src/systems/display";
import { Ent, TSystem } from "./ecs-src/systems/shared";
import { useInView } from "react-intersection-observer";

type DemoBlockProps = {
  entities: Ent[];
  systems: TSystem[];
};

export const DemoBlock = ({ entities, systems }: DemoBlockProps) => {
  // Game state (keeping original for reset)
  const origEntities = useRef(structuredClone(entities));
  const currEntities = useRef(structuredClone(entities));

  // track in-view status
  const { ref: divRef, inView } = useInView({ threshold: 1 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleReset = () => {
    currEntities.current = structuredClone(origEntities.current);
  };

  const tick = useCallback(() => {
    for (const system of [new DisplaySystem(canvasRef.current), ...systems]) {
      system.update(currEntities.current);
    }
  }, [systems]);

  // run the game loop
  useInterval(tick, inView ? 10 : null);

  useEffect(() => {
    tick();
  }, [tick]);

  return (
    <div ref={divRef} className={style.demoBlock} style={{ width: "100%" }}>
      <canvas
        className={style.canvas}
        width={600}
        height={300}
        ref={canvasRef}
        style={{ width: 500 }}
      />
      <button className={style.reset} onClick={handleReset}>
        reset
      </button>
    </div>
  );
};
