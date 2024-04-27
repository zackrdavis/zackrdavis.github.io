import Image from "next/image";

export const ImageFull = (props: any) => {
  const { width, height } = props.src;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: width / height,
      }}
    >
      <Image
        src={props.src}
        alt={props.alt}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />
    </div>
  );
};
