## Fonting with GANs #2

### 3/5/2024

I got an itch to make weird interactions with client-side generative models. [Previously](/fonting-with-gans), I trained a GAN on unlabeled handwritten characters, found inputs to generate each character, and exported it for use in JS with [ONNX](https://onnxruntime.ai/docs/). On its own, though, the network was just turning numbers into numbers. To see anything I'd need to complete the pipeline from input to image.

Where did I end up? Click in this black box and do some typing:

<iframe src="https://codesandbox.io/embed/rl423h?view=preview&module=%2Fsrc%2FGlyph.tsx"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="emnist-onnx-typing"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Glyph Generator

Let's say I know an input that generates a good letter "E". How do I turn run that through the network and get an image in the browser?

First I get an `InferenceSession` going:

```ts
import { InferenceSession, Tensor } from "onnxruntime-web";

const session = await InferenceSession.create("vgan_emnist.onnx", {
  executionProviders: ["webgl"],
  graphOptimizationLevel: "all",
});
```

Then I run the input through the model. Any array of 100 values between -1 and 1 will generate _something_. The keys `z` (input) and `img` (output) were defined when I exported the model from PyTorch.

```ts
const input = addresses["E"];

// covert to ONNX Tensor
const tensor = new Tensor("float32", input, [1, 100]);

// run the model
const {
  img: { data },
} = await session.run({ z: tensor });
```

Map the range of the output (-1–1) onto the web color range 0–255. Then create a data structure that we can apply to the canvas, a flat list of 28 x 28 x 4 = 3136 values. Overwrite these 4-at-a-time since the output is grayscale, and finally put it on the canvas.

```ts
// map -1-1 to 0-255
const asUInt8 = Uint8Array.from(img.data, (val) =>
  mapRange(val, -1, 1, 0, 255)
);

// canvas data that we'll overwrite
const canvasData = new ImageData(28, 28);

// fill RGB with luminance value. Alpha always 255
for (let i = 0; i < canvasData?.data.length; i += 4) {
  canvasData.data[i + 0] = asUInt8[Math.floor(i / 4)];
  canvasData.data[i + 1] = asUInt8[Math.floor(i / 4)];
  canvasData.data[i + 2] = asUInt8[Math.floor(i / 4)];
  canvasData.data[i + 3] = 255;
}

// draw to the canvas
canvas.getContext("2d")?.putImageData(canvasData, 0, 0);
```

I never properly benchmarked it, but this pipeline worked fast. I was able to feed it new inputs with a `setInterval` delay of 0.

## A Familiar Interface

I definitely wanted to type in this font. Morphing would happen at some point, but I wanted it in the context of a fluid text interaction with a cursor and highlighting, not boxed-up in unfamiliar UI. I basically wanted a big `<textarea>`.

So that's what I started with. That would accept all of the interactions, provide a blinking cursor and text-selection highlights, and hide its own actual text with a transparent color. Behind it I'd have a div full of inline `<canvas>` glyphs. For every character typed I'd render a corresponding glyph. I spun up a react app to keep them synced, since I expected the UI to expand as I messed around.

![Letters typed on two separated planes. On the front plane, letters are a monospace font. On the back plane they look like white letters handwritten on a black background.](/images/fonting-with-gans-2/typing.gif)

To keep the text and the glyphs aligned:

- The `<textarea>` used a monospaced font
- Properties `font-size`, `line-height` and `letter-spacing` were tweaked until the monospace font had perfectly square letters.
- The generated glyphs had `display:inline` for the glyphs so they wrapped like text.
- The glyph container had `white-space: pre-wrap` and `overflow-wrap: break-word` to make sure it flowed as it should.

And it all worked until I started testing lots of whitespace.

![Letters typed on two separated planes. On the front plane, letters are a monospace font. On the back plane they look like white letters handwritten on a black background. When whitespaces are typed, the two texts become misaligned.](/images/fonting-with-gans-2/whitespace-breaks.gif)

Canvases aren't characters, so browsers don't know to avoid breaking them when line-wrapping. Multiple returns in a row also gave me trouble. I tried various combinations of `display`, `white-space` and `overflow-wrap`, but things that got close-enough in one browser would be way off in the others. Things would be so much easier if the glyphs really were inline characters, but I couldn't apply a background to a letter...

Unless it was wrapped in a span, which is how we apply styles like highlighting to flowing text. So instead of a sequence of canvases, I'd have a sequence of spans containing one letter apiece, each with a background-image.

### Secret Canvas

I already had a canvas displaying the glyph, and `canvas.toDataUrl()` would give me a base64-encoded image that I could use as the span background. And I could even keep this intermediate canvas out of the DOM and still use `putImageData` and `toDataUrl`. All wrapped up, it looked like this:

```ts
const nnOutToDataUrl = (data: Float32Array, width: number, height: number) => {
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
```

I applied these as `background-image` to my spans, and I finally had the glyphs behaving exactly like characters in the `<textarea>`, a familiar interaction that I could now start bending.

![Letters typed on two separated planes. On the front plane, letters are a monospace font. On the back plane they look like white letters handwritten on a black background.](/images/fonting-with-gans-2/whitespace-works.gif)

## Lerping through Latent Space

Remember the hexapod glyphs in Arrival? I wanted to see something like that, so I decided all glyphs would start as a small, dense form and unfurl into their final shape. The capital "I" seemed like a good starting shape so I went with it.

In writing this I've gone back and forth between numerical and spatial language, but I find spatial more intuitive so I'll try to stick with it. Just know that a transition like this `[0, 0, 0] -> [1,1,1]`is equivalent to a diagonal move in 3-D space. The addresses I had collected are locations in 100-D space that I could interpolate between, or "lerp".

This function takes the current address, the destination, and a rate of movement, returning the next address and a flag for whether it's the final step:

```ts
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
```

When rendering a glyph, I'd run this on loop using [Josh Comeau's useInterval hook](https://www.joshwcomeau.com/snippets/react-hooks/use-interval/) until it transitioned from "I" to its target character.

I didn't specify the number of steps, thinking the animation would be "distance-preserving" with regard to the location of images, so a transition between near neighbors like "1" and "l" would finish faster than between "G" and "x". I now see that It doesn't proceed directly toward the destination, but along X=Y diagonals. I have no intuition at all for what this means in 100-dimensional space, but it does roughly work to ensure that "1" → "i" is a quicker animation than "1" → "G", for instance.

## Spamming the Generator

My stepping function also made it a bit harder to reason about how many images I was actually generating, which became a problem when I started seeing blank glyphs accompanied by this error: `Uncaught (in promise) Error: output [10] already has value:...`

Something was upsetting (but not crashing) the ONNX InferenceSession, and some inference requests weren't being fulfilled. I couldn't find a reference to it in the docs [here](https://onnxruntime.ai/docs/) or [here](https://onnxruntime.ai/docs/api/js/index.html), but it happened when I requested inference while it was working to fulfill a previous promise.

The async `InferenceSession.run` could handle this:

```ts
setInterval(() => {
  sessionRef.current.run({ z: tensor });
}, 0);
```

But not this:

```tsx
// newly inserted
<Glyph key={0} char="0"/>
// re-keyed by the insert, rendering synchronously
<Glyph key={1} char="1"/>
<Glyph key={2} char="2"/>
```

To nip this issue in the bud, I'd need to queue the `run` promises and return each result. This was way more difficult to wrap my head around than queuing plain synchronous functions. Thankfully I found this [medium post](https://medium.com/@karenmarkosyan/how-to-manage-promises-into-dynamic-queue-with-vanilla-javascript-9d0d1f8d4df5) and [sandbox](https://codepen.io/ogostos/pen/oVxZxQ) that addressed the problem perfectly. With a `PromiseQueue` class, I could throw inference requests willy-nilly and know that each would be resolved in turn.

This felt like such a prominent footgun for ONNX in React that I decided to wrap `PromisQueue` with the session in a custom hook, `useOnnxWeb`. This would also enforce one single session per-model per-app.

## Wrapping Up

With that in place, I had the two biggest technical questions answered. I could interact with the glyphs like a `<textarea>` and I could animate them performantly.

One nice surprise was the way that typing or deleting before the end of the text would cause all subsequent glyphs to morph into their new forms. Because I keyed the Glyph components with the index of characters,
they only rendered from scratch at the end of the text.

Starting with the following letters at the following indexes:

```
a b c d e f g
1 2 3 4 5 6 7
```

Typing X in the middle leads to:

```
a b c X d e f g
1 2 3 4 5 6 7 8
```

Letters "d e f g" smoothly transition to "X d e f", and the final "g" is rendered from scratch.
