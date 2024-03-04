import { ReactNode } from "react";
import Image from "next/image";

type BlockProps = {
  title?: string;
  children?: ReactNode;
  href?: string;
  media?: {
    src: string;
    alt: string;
  };
};

export const Block = ({ media, title, children, href }: BlockProps) => {
  const WrapTag = href ? "a" : "div";

  const mediaNode =
    media && media.src.includes("vimeo") ? (
      <div className="background">
        <iframe
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          src={`${media.src}?background=1`}
          width="450"
          height="253"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          title="Homunculus House"
        ></iframe>
      </div>
    ) : media ? (
      <div className="background">
        <Image src={media.src} width="450" height="300" alt={media.alt} />
      </div>
    ) : null;

  return (
    <div className="block">
      {(media || title) && (
        <WrapTag className="main" href={href}>
          {mediaNode}
          {title && <h2>{title}</h2>}
        </WrapTag>
      )}
      <div className="text">{children}</div>
    </div>
  );
};
