const clamp = (input: number, min: number, max: number): number => {
  return input < min ? min : input > max ? max : input;
};

export const projectRange = (
  current: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number => {
  const mapped: number =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
};

// interpolate from current coords toward destination
export const stepFromTo = (
  current: number[],
  destination: number[],
  stepSize: number
) => {
  const newAddr: number[] = [];

  current.forEach((curr, i) => {
    const dest = destination[i];
    const diff = dest - curr;

    if (Math.abs(diff) <= stepSize) {
      // if increment would go past dest, go to dest
      newAddr.push(dest);
    } else {
      // otherwise, increment toward dest
      newAddr.push(curr + Math.sign(diff) * stepSize);
    }
  });

  return newAddr;
};

export const randomProperty = (obj: any) => {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};
