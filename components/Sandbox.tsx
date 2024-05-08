"use client";

import { Sandpack, SandpackInternal } from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import React from "react";

export const Sandbox: SandpackInternal = ({ ...rest }) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <Sandpack theme={atomDark} {...rest} />
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
