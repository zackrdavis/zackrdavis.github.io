import type { MDXComponents } from "mdx/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
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
