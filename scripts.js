// make all elements handy
const body = document.body;
const xScrollParent = document.querySelector("#xScrollParent");
const xScrollChild = document.querySelector("#xScrollChild");
const yScrollParent = document.querySelector("#yScrollParent");
const yScrollChild = document.querySelector("#yScrollChild");
const images = document.querySelectorAll("img");

// init variables
let winWidth, winHeight, contentWidth, scrollBar;
let xInit = false;
let yInit = false;

/**
 * Precalculate all dimensions &
 * Force y-scroll distance to match x-scroll
 * */
const setup = () => {
  // precalc sizes
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;
  contentWidth = xScrollParent.scrollWidth;
  scrollBar = xScrollParent.offsetHeight - xScrollParent.clientHeight;

  // new body height approximates content width
  // adjusted for difference between window width/height
  // adjusted for scrollbar width
  const newHeight = contentWidth - (winWidth - winHeight) + scrollBar;

  // set the style
  yScrollChild.style.height = newHeight + "px";
};

/** Set y-scroll when x-scrolling */
const handleXScroll = () => {
  // do nothing on mobile
  if (winWidth <= 580) return false;

  // don't re-trigger this function with the Y scroll we're about to cause
  if (!yInit) {
    xInit = true;

    yScrollParent.scrollTop = xScrollParent.scrollLeft;
  }

  // reset
  yInit = false;
};

/** Set x-scroll when y-scrolling */
const handleYScroll = () => {
  // do nothing on mobile
  if (winWidth <= 580) return false;

  // don't re-trigger this function with the X scroll we're about to cause
  if (!xInit) {
    yInit = true;

    xScrollParent.scrollLeft = yScrollParent.scrollTop;
  }

  // reset
  xInit = false;
};

/** Replace img src with retina sizes */
const retinaSizeImages = () => {
  if (window.devicePixelRatio > 1) {
    images.forEach((img) => {
      const oldSrc = img.src;
      const dotIndex = oldSrc.lastIndexOf(".");
      img.src = oldSrc.slice(0, dotIndex) + "_retina" + oldSrc.slice(dotIndex);
    });
  }
};

// set listeners
window.addEventListener("resize", setup);

window.addEventListener("scroll", () => requestAnimationFrame(handleYScroll));

xScrollParent.addEventListener("scroll", () =>
  requestAnimationFrame(handleXScroll)
);

// size and measure things
retinaSizeImages();
setup();

// position based on possible saved scroll
handleYScroll();
handleXScroll();
