import { InferenceSession, Tensor } from "onnxruntime-web";
import { projectRange, randomProperty, stepFromTo } from "./utils";
import { addresses } from "./addresses";

let target = addresses["O"];
let current = addresses["l"];

export const main = async () => {
  const button = document.getElementById("button");
  const canvas = document.getElementById("canvas");
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
  });

  document.addEventListener("keydown", (e) => {
    if (addresses[e.key] && !e.metaKey) {
      target = addresses[e.key];
    }
  });

  setInterval(() => {
    if (JSON.stringify(current) !== JSON.stringify(target)) {
      const newAddr = stepFromTo(current, target, 0.2);
      generate_to_canvas(newAddr);
      current = newAddr;
    }
  }, 50);
};

document.getElementById("app").innerHTML = `
  <div style="display:flex; flex-direction:column; gap: 20px; align-items:center; justify-content:center;">
  <canvas
    id="canvas"
    width="28"
    height="28"
    style="
      width: 100px;
      height: 100px;
    "
  ></canvas>
  <div>Type some alphanumeric characters</div>
  <button id="button">Click to randomize</button>
  </div>
`;

main();
