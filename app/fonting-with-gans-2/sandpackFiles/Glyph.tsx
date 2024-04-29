import { useEffect, useState } from "react";
import styled from "styled-components";
import _ from "underscore";
import { nnOutToDataUrl, stepFromTo } from "./utils";
import { Tensor } from "onnxruntime-web";
import { addresses } from "./addresses";
import { useOnnxWeb } from "./useOnnxWeb";
import { useInterval } from "./useInterval";

const StyledSpan = styled.span`
  background-repeat: no-repeat;
  background-size: cover;
  color: transparent;
`;

export const Glyph = ({ chars }: { chars: string }) => {
  const [didArrive, setArrived] = useState(false);
  const [currAddress, setCurrAddress] = useState<number[]>(addresses["I"]);
  const [img, setImg] = useState("");

  const { run } = useOnnxWeb("https://zackdavis.net/vgan_emnist.onnx");

  useEffect(() => {
    if (JSON.stringify(currAddress) !== JSON.stringify(addresses[chars])) {
      setArrived(false);
    }
  }, [chars, currAddress]);

  useInterval(
    () => {
      const { newAddress, arrived } = stepFromTo(
        currAddress,
        addresses[chars],
        0.05
      );

      setArrived(arrived);
      setCurrAddress(newAddress);

      run({ z: new Tensor("float32", newAddress, [1, 100]) }).then(
        (nnOutput) => {
          if (nnOutput) {
            const imgData = nnOutput.img.data;
            const dataUrl = nnOutToDataUrl(imgData as Float32Array, 28, 28);
            setImg(dataUrl);
          }
        }
      );
    },
    didArrive ? null : 10
  );

  return (
    <>
      <StyledSpan
        style={{
          backgroundImage: `url(${img})`,
        }}
      >
        {chars[0]}
      </StyledSpan>
    </>
  );
};
