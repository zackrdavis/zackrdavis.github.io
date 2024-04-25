import { Block } from "../components/Block";
import Markdown from "react-markdown";

import picadilly_radiator from "./home-deep-learning/assets/picadilly_radiator.png";
import twisted from "./fonting-with-gans/assets/twisted.png";

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
            src: picadilly_radiator.src,
            alt: "An ornate silver steam radiator",
          }}
          href="/home-deep-learning"
        >
          Tools and workflow for desktop-GPU training from the comfort of my
          MacBook.
        </Block>

        <Block
          title="Fonting with GANs"
          media={{
            src: twisted.src,
            alt: "",
            position: "top center",
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
        {/* 
        <Block
          title="Launchpad Living"
          media={{
            src: "/images/launchpad.png",
            position: "top center",
            fit: "contain",
            alt: "",
            color: "rgb(38,73,44)",
          }}
          href="https://www.launchpadliving.org/"
        >
          Landing page for Launchpad Living, providing housing.
        </Block> */}

        <Block
          title="Museum of Us"
          media={{
            src: "/images/mou_logo.gif",
            position: "center center",
            alt: "",
          }}
          href="https://museumofus.org/"
        >
          A new website for the Museum of Us in San Diego, designed by Rebecca
          Friedman. Built for speed, accessibility, and pleasant editing with
          Next.js and Sanity CMS.
        </Block>

        <Block
          title="A Robot Actor"
          media={{
            src: "/images/paradiso_robot_retina.jpg",
            alt: "",
            position: "top center",
          }}
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
