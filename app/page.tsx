import { Block } from "./Block";
import Markdown from "react-markdown";

const intro = `
I'm a software engineer with lots of experience building fast, fun,
accessible user-interfaces. I've worked with data-intensive
enterprise projects, startups, museums and theater companies.

Outside of work, I'm an [artist](http://zackdavis.net) and a
gardener. I live in Portland, Oregon.

I'd love to hear from you:

[zackrdavis@gmail.com](mailto:zackrdavis@gmail.com) • [GitHub](https://github.com/zackrdavis) • [Linkedin](https://www.linkedin.com/in/zackrdavis)
`;

export default function Home() {
  return (
    <main>
      <div className="grid">
        <Block>
          <Markdown>{intro}</Markdown>
        </Block>

        <Block
          title="Home Deep Learning"
          media={{
            src: "/images/home-deep-learning/picadilly_radiator.png",
            alt: "",
          }}
          href="/home-deep-learning"
        >
          Tools and workflow for desktop-GPU training from the comfort of my
          MacBook.
        </Block>

        <Block
          title="Fonting with GANs"
          media={{
            src: "/images/fonting-with-gans/twisted_samples.png",
            alt: "",
          }}
          href="/fonting-with-gans"
        >
          Learning the space of handwritten letters and numbers with PyTorch,
          then inverting to find the best match for each character.
        </Block>

        <Block
          title="Fonting with GANs #2"
          media={{ src: "/images/fonting2.mp4", alt: "" }}
          href="/fonting-with-gans-2"
        >
          Building a weird text input with client-side generative glyphs.
        </Block>

        <Block
          title="Museum of Us"
          media={{ src: "/images/mou.gif", alt: "" }}
          href="https://museumofus.org/"
        >
          A new website for the Museum of Us in San Diego, designed by Rebecca
          Friedman. Built for speed, accessibility, and pleasant editing with
          Next.js and Sanity CMS.
        </Block>

        <Block
          title="A Robot Actor"
          media={{ src: "/images/paradiso_robot_retina.jpg", alt: "" }}
          href="https://greenenaftaligallery.com/exhibitions/richard-maxwell#1"
        >
          <Markdown>
            {`Developed for Richard Maxwell's Paradiso, the robot delivers lines,
            visually tracks fellow actors, and generates a unique script during
            each performance. Paradiso was a [NYT Critic's
            Pick](https://www.nytimes.com/2018/01/16/theater/paradiso-richard-maxwell-review.html).`}
          </Markdown>
        </Block>

        <Block
          title="New York City Players"
          media={{ src: "/images/nycp.gif", alt: "" }}
          href="https://nycplayers.org/"
        >
          Typed-while-you-watch homepage for the New York City Players theater
          company. Designed by Scott Ponik.
        </Block>

        <Block
          href="https://zackdavis.net/homunculus_house/"
          title="Homunculus House"
          media={{ src: "/images/homunculus_house.mp4", alt: "" }}
        >
          Simulated views and illumination for a house rolling downhill.
          Presented at the Portland2014 Biennial. 4-channel projected video, no
          sound.
        </Block>

        <Block title="FuiszVideo" media={{ src: "/images/fuisz.png", alt: "" }}>
          Frontend engineering at FuiszVideo, an ad publishing platform that
          used machine vision to make interactive videos.
        </Block>

        <Block
          href="https://artspeak.ca/"
          title="Artspeak"
          media={{ src: "/images/artspeak.png", alt: "" }}
        >
          Website for a beloved Vancouver arts institution. Designed by Scott
          Ponik and Julie Peeters.
        </Block>
      </div>
    </main>
  );
}
