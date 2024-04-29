function clamp(input: number, min: number, max: number): number {
  return input < min ? min : input > max ? max : input;
}

export function projectRange(
  current: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number {
  const mapped: number =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

export const nnOutToDataUrl = (
  data: Float32Array,
  width: number,
  height: number
) => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", String(width));
  canvas.setAttribute("height", String(height));

  // map -1-1 to 0-255
  const asUInt8 = Uint8Array.from(data as Float32Array, (val) =>
    projectRange(val, -1, 1, 0, 255)
  );

  // canvas data that we'll overwrite
  const canvasData = new ImageData(width, height);

  // fill RGB with luminance value. Alpha always 255
  for (let i = 0; i < canvasData?.data.length; i += 4) {
    canvasData.data[i + 0] = asUInt8[Math.floor(i / 4)];
    canvasData.data[i + 1] = asUInt8[Math.floor(i / 4)];
    canvasData.data[i + 2] = asUInt8[Math.floor(i / 4)];
    canvasData.data[i + 3] = 255;
  }

  // draw to the canvas
  canvas.getContext("2d")?.putImageData(canvasData, 0, 0);

  return canvas.toDataURL();
};

export const stepFromTo = (
  currentAddress: number[],
  destinationAddress: number[],
  stepSize: number
) => {
  const newAddress = [];
  const arrivedList: boolean[] = [];

  for (const [i, current] of currentAddress.entries()) {
    const destination = destinationAddress[i];
    const diff = destination - current;

    if (Math.abs(diff) <= stepSize) {
      // if increment would go past destination, use destination
      newAddress.push(destination);
      // add to list of arrived dimensions
      arrivedList.push(true);
    } else {
      // otherwise, increment toward destination
      newAddress.push(current + Math.sign(diff) * stepSize);
    }
  }

  return {
    newAddress,
    arrived: arrivedList.length == destinationAddress.length,
  };
};
