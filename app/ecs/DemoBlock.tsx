import { useRef } from "react";
import { useInterval } from "../helpers/useInterval";
import style from "./demoBlock.module.css";
import { DisplaySystem } from "./ecs-src/systems/display";
import { Ent, TSystem } from "./ecs-src/systems/shared";
import { useInView } from "react-intersection-observer";

type DemoBlockProps = {
  entities: Ent[];
  systems: TSystem[];
};

const tick = (systems: TSystem[], entities: Ent[]) => {
  for (const system of systems) {
    system.update(entities);
  }
};

export const DemoBlock = ({ entities, systems }: DemoBlockProps) => {
  const { ref: divRef, inView } = useInView({ threshold: 1 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleReset = () => {
    console.log("reset");
  };

  // run the game loop
  useInterval(
    () => {
      tick([...systems, new DisplaySystem(canvasRef.current)], entities);
    },
    inView ? 10 : null
  );

  return (
    <div ref={divRef} className={style.demoBlock} style={{ width: "100%" }}>
      <canvas
        className={style.canvas}
        width={600}
        height={300}
        ref={canvasRef}
        style={{ width: 500 }}
      />
      <button onClick={handleReset}>reset</button>
    </div>
  );
};
