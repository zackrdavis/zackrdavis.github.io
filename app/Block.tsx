import { ReactNode } from "react";
import Image from "next/image";
import { VideoPlayer } from "./VideoPlayer";

type BlockProps = {
  title?: string;
  children?: ReactNode;
  href?: string;
  media?: {
    src: string;
    alt: string;
    position?: string;
    fit?: "fill" | "contain" | "cover" | "none" | "scale-down";
    color?: string;
  };
};

export const Block = ({ media, title, children, href }: BlockProps) => {
  const WrapTag = href ? "a" : "div";

  const mediaNode =
    media && media.src.includes("vimeo") ? (
      <div
        className="background"
        style={{ background: media.color || "black" }}
      >
        <iframe
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          src={`${media.src}?background=1`}
          width="450"
          height="253"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          title="Homunculus House"
        ></iframe>
      </div>
    ) : media && media.src.includes(".mp4") ? (
      <div
        className="background"
        style={{ background: media.color || "black" }}
      >
        <VideoPlayer src={media.src} />
      </div>
    ) : media ? (
      <div
        className="background"
        style={{ background: media.color || "black" }}
      >
        <Image
          src={media.src}
          width="450"
          height="300"
          alt={media.alt}
          style={{
            objectPosition: media.position || "center center",
            objectFit: media.fit || "cover",
          }}
        />
      </div>
    ) : null;

  return (
    <div className="block">
      {(title || media) && (
        <WrapTag className="main" href={href}>
          {title && <h2>{title}</h2>}
          {media && mediaNode}
        </WrapTag>
      )}

      <div className="text">{children}</div>
    </div>
  );
};
