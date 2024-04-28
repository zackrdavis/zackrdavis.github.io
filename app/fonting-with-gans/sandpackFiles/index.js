import { InferenceSession, Tensor } from "onnxruntime-web";
import { projectRange, randomProperty, stepFromTo } from "./utils";
import { addresses } from "./addresses";

let target = addresses["A"];
let current = addresses["A"];
let changed = false;

export const main = async () => {
  const button = document.querySelector("button");
  const canvas = document.querySelector("canvas");
  const canvasContext = canvas.getContext("2d");

  const session = await InferenceSession.create(
    "https://zackdavis.net/vgan_emnist.onnx",
    {
      executionProviders: ["webgl"],
      graphOptimizationLevel: "all",
    }
  );

  const generate_to_canvas = async (input) => {
    // inputs must be an ONNX Tensor
    const tensor = new Tensor("float32", input, [1, 100]);

    // run the model
    const { img } = await session.run({ z: tensor });

    // map the raw outputs from range [-1, 1] to [0, 255]
    const asUInt8 = Uint8Array.from(img.data, (val) =>
      projectRange(val, -1, 1, 0, 255)
    );

    // placeholder canvas data that we'll overwrite
    const canvasData = canvasContext.createImageData(28, 28);

    // fill RGB with original Luminance value (inverted)
    for (let i = 0; i < canvasData.data.length; i += 4) {
      canvasData.data[i + 0] = asUInt8[Math.floor(i / 4)];
      canvasData.data[i + 1] = asUInt8[Math.floor(i / 4)];
      canvasData.data[i + 2] = asUInt8[Math.floor(i / 4)];
      canvasData.data[i + 3] = 255; // alpha always 255
    }

    canvasContext.putImageData(canvasData, 0, 0);
  };

  button.addEventListener("click", async () => {
    target = randomProperty(addresses);
    changed = true;
  });

  document.addEventListener("keydown", (e) => {
    if (addresses[e.key] && !e.metaKey) {
      target = addresses[e.key];
      changed = true;
    }
  });

  setInterval(() => {
    if (changed) {
      if (JSON.stringify(current) == JSON.stringify(target)) {
        changed = false;
      } else {
        const newAddr = stepFromTo(current, target, 0.05);
        generate_to_canvas(newAddr);
        current = newAddr;
      }
    }
  }, 10);

  generate_to_canvas(current);
};

main();
