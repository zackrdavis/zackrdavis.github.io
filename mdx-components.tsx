import type { MDXComponents } from "mdx/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Image: (props) => <div style={{ position: "relative" }}>TESTING</div>,
    img: (props) => {
      // console.log(props);

      return (
        <img
          alt={props.alt}
          {...props}
          style={{ width: "100%", maxWidth: "100%" }}
        />
      );
    },
    code: ({ className, ...properties }: any) => {
      const match = /language-(\w+)/.exec(className || "");

      return match ? (
        <SyntaxHighlighter
          language={match[1]}
          PreTag="div"
          style={oneDark}
          {...properties}
        />
      ) : (
        <code className={className} {...properties} />
      );
    },
    ...components,
  };
}
