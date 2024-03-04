import fs from "fs";
import matter from "gray-matter";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const renderers = {
  img: ({
    alt,
    src,
    title,
  }: {
    alt?: string;
    src?: string;
    title?: string;
  }) => (
    <Image
      width="0"
      height="0"
      sizes="(max-width: 900px) 100vw, 800px"
      alt={alt || ""}
      src={src || ""}
      style={{ width: "100%", height: "auto" }}
    />
  ),
  code: (props: any) => {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <SyntaxHighlighter
        {...rest}
        PreTag="div"
        children={String(children).replace(/\n$/, "")}
        language={match[1]}
        style={oneDark}
      />
    ) : (
      <code {...rest} className={className}>
        {children}
      </code>
    );
  },
};

export const dynamicParams = false;

const pageSlugs = fs
  .readdirSync("md-pages")
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(".md", ""));

export async function generateStaticParams() {
  return pageSlugs;
}

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!pageSlugs.includes(slug)) {
    return notFound();
  }

  const fileContents = fs.readFileSync(`md-pages/${slug}.md`, "utf8");

  return (
    <main className="text">
      <Markdown rehypePlugins={[rehypeRaw]} components={renderers}>
        {fileContents}
      </Markdown>
    </main>
  );
}
