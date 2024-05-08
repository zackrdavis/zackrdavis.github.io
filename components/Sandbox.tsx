"use client";

import { Sandpack, SandpackProps } from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import React from "react";
import styles from "./Sandbox.module.css";

type SandboxProps = SandpackProps & {
  verticalModeHeight?: number;
};

export const Sandbox = ({
  options,
  verticalModeHeight,
  ...rest
}: SandboxProps) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const verticalProps =
    verticalModeHeight !== undefined
      ? {
          style: { height: verticalModeHeight },
          options: {
            ...options,
            classes: {
              "sp-layout": styles.vertical_layout,
            },
          },
        }
      : { options };

  const sandpackProps = {
    theme: atomDark,
    ...rest,
    ...verticalProps,
  };

  return isClient ? (
    <Sandpack {...sandpackProps} />
  ) : (
    <div
      style={{
        height: 300,
        width: "100%",
        borderRadius: 4,
        background: "RGB(41,44,51)",
      }}
    />
  );
};
