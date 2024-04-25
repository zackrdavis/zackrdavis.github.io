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
      <Image src={props.src} alt={props.alt} layout="fill" objectFit="cover" />
    </div>
  );
};
