import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => (
    //   <h1 style={{ color: 'red', fontSize: '48px' }}>{children}</h1>
    // ),
    ...components,
  };
}
