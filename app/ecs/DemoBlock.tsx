import style from "./demoBlock.module.css";
import { Ent, TSystem } from "./ecs-src/systems/shared";
import { useInViewport } from "../helpers/useInViewport";
import { useInterval } from "../helpers/useInterval";

type DemoBlockProps = {
  entities: Ent[];
  systems: TSystem[];
};

export const DemoBlock = ({ entities, systems }: DemoBlockProps) => {
  const { isInViewport, ref } = useInViewport();

  useInterval(
    () => {
      console.log("I fire every second!");
    },
    isInViewport ? 1000 : null
  );

  return (
    <div
      ref={ref}
      className={style.demoBlock}
      style={isInViewport ? { background: "red" } : {}}
    >
      Testing
    </div>
  );
};
