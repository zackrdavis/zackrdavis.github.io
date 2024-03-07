"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";

export const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [didRender, setDidRender] = useState(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current?.pause();
      setPaused(true);
    }
    e.preventDefault();
  };

  // if JS is enabled, use custom control
  useEffect(() => setDidRender(true), []);

  return (
    <>
      <video src={src} ref={videoRef} autoPlay muted loop playsInline />
      {didRender && (
        <button
          className="playPause"
          title={paused ? "play" : "pause"}
          onClick={handleClick}
        >
          {paused ? "⏵︎" : "⏸︎"}
        </button>
      )}
    </>
  );
};
