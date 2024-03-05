## Fonting with GANs

### 1/30/2024

During my virtual residency at the [Recurse Center](https://www.recurse.com/), one of my goals was to get comfortable with PyTorch and Jupyter notebooks. Another was to build some highly responsive UI around machine learning. I've always been intrigued by [David Ha's formulation](https://otoro.net/ml/) that resource constraints drove the development of cognition's best tricks, and I hadn't seen a lot of inference executing in the browser. What kind of UI is possible with small models and no perceptible delay?

My first stab in this direction was an in-browser Generative Adversarial Net with the EMNIST handwriting dataset. And, putting the prize up front, here it is, running fast enough animate latent-space-interpolation in real time:

<iframe src="https://codesandbox.io/embed/7rd69j?view=preview" width="100%" height="300" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

You can find the code for the Python side of this project here: [VGAN-EMNIST Inversion](https://github.com/zackrdavis/VGAN-EMNIST-Inversion). Big picture, this involved:

- training on a fast desktop with a Jupyter notebook
- finding ideal inputs for all 62 alphanumeric characters, a process called [inversion](https://arxiv.org/pdf/2101.05278.pdf)
- exporting the trained network for [ONNX Runtime](https://onnxruntime.ai/docs/get-started/with-javascript.html)
- some math for smoothly interpolating between inputs

Unlike most diffusion networks, GANs produce images in a single fast feedforward step, and their output makes up a smooth and [structured](https://machinelearningmastery.com/how-to-interpolate-and-perform-vector-arithmetic-with-faces-using-a-generative-adversarial-network/) latent space. This is why I thought they might be fast enough for animation, and their animation would be formally compelling.

I used Diego Gomez's [Vanilla GAN in PyTorch](https://github.com/diegoalejogm/gans) as a starting point and swapped the MNIST (numeric) dataset for EMNIST (alphanumeric). My training results were pretty weird, without a lot of recognizable characters. Maybe that's to be expected in the latent space between letters? Then I visualized the first batch of training data:

![a grid of handwritten numbers and letters with each one mirrored and rotated 90 degrees](/images/fonting-with-gans/twisted_samples.png)

It's hard to see what's going on unless you know what to look for, but TorchVision's EMNIST data is mirrored and rotated -90 degrees. Two extra transforms set things right:

```python
compose = transforms.Compose([
  transforms.ToTensor(),
  transforms.Normalize([0.5], [0.5]),

  # rotate all images -90deg counter-clockwise
  transforms.RandomRotation((-90,-90)),
  # horizontal flip all images (probability = 1)
  transforms.RandomHorizontalFlip(p=1),
])
```

Everything worked as expected after that, and 200 training epochs later, the network was making familiar shapes. Because I wasn't using labeled data, these random samples show a handful of hybrid weirdos, but they seemed oriented correctly.

![Two rows of white glyphs on a black background. The letters are distorted and unreadable.](/images/fonting-with-gans/weirdos.png)

## The Map

To render an actual letter repeatably, I'd need to find a nice version generated by the network and note the 100-value input that created it (or its coordinates in this particular 100-dimensional image-space). Here's one:

`[
    -1.0, -1.0, 1.0, -0.0486, -1.0, 0.9989, -1.0, -0.1445, -0.3458, 1.0, 1.0,
    -1.0, 1.0, 1.0, -1.0, -0.3575, 1.0, -1.0, 0.7807, -1.0, -1.0, -1.0, 1.0,
    1.0, 1.0, 0.1007, -1.0, 1.0, -0.9726, -1.0, 1.0, -1.0, -0.9486, 1.0, 0.2914,
    1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 0.1367, -0.9471, 0.2176, 1.0, -1.0,
    0.6586, 0.8326, -0.7876, -1.0, -0.3623, 0.5928, 0.7861, 1.0, 0.546, -1.0,
    -1.0, 0.4815, 1.0, -1.0, 1.0, 1.0, 0.3592, 1.0, -0.0093, -1.0, -1.0, -1.0,
    0.8022, 0.8678, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 0.9368, 0.983, 0.9562,
    0.6253, -0.5211, -1.0, -1.0, -1.0, 1.0, 1.0, -0.2063, -0.1222, 0.9239,
    0.4377, -1.0, 1.0, -1.0, -1.0, -1.0, -0.3888, 0.7914, -0.6846, -0.9638, 1.0,
  ]`

I gathered these manually for a while by randomly sampling, then copy-pasting the input for any well-formed character. This got ineffective really quickly as I filled out my collection, and it became clear that I needed to automate.

## Inversion

I give thanks to Fast.ai's [great explanation of SGD](https://github.com/fastai/fastbook/blob/master/04_mnist_basics.ipynb) for making this thinkable: For each character, I'd take a single real example from the labeled data and _gradient-descend_ through the latent space for a similar fake image. This is possible because we can treat the input/coordinates of an image just like we treat model weights during training: feedforward through the network, determine the error between the output and the real image, and backpropagate up to the input to learn how it should change. My search function ended up looking something like this:

```python
def inversion_search(target_img, generator, steps=100, rate=0.01):
	input = torch.zeros(100).requires_grad_()

    for i in range(steps):
        loss = emnist_gan_mse(input, target_img, generator)
        loss.backward()

        with torch.no_grad():
            for j in range(len(input)):
                input[j] = torch.clamp(input[j] - input.grad[j] * rate, -1, 1)

    return input
```

A deeply silly bug almost made me give up on this: I had the inversion search working on the pre-transform mirrored and twisted data. Again, amazing how hard this was to see when I wasn't specifically looking for it. It wasn't until I visualized all the targets in order that I saw it. This hammered home the value of fluency with matpotlib. As long as it's a pain, I'm less likely to spot patterns that, at this level of abstraction, just have to be presented visually.

Anyway, here's the working search, animated in order to convey a fraction of my dawning joy when I fixed the bug.

![A grid of black tiles with white forms that slowly become handwritten characters.](/images/fonting-with-gans/search.gif)

## Packaging for the Frontend

With a map to every character I'd want to render, it was time to bring the generator network into the browser. `Torch.onnx` needs to actually run the model to export it, so I provided an input, then names for the data going in and out, which became object keys in JavaScript. I also exported the map to a JSON file.

```python
torch.onnx.export(
	# network with desired weights loaded
	generator,
	# properly shaped random input
	torch.randn(1, 100),
	# output filename
	"vgan_emnist.onnx",
	# JS object keys
    input_names=["z"],
    output_names=["img"],

    verbose=False,
    export_params=True,
)
```

The sandbox at the top of this writeup uses `onnxruntime-web` to run the exported network. Its character map is a combination of the best images from several runs of the inversion search, saved in `addresses.json`.

[Project Repo](https://github.com/zackrdavis/VGAN-EMNIST-Inversion)