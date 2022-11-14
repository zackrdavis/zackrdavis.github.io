/** Force window's Y scroll to match xScrollContainer's X scroll */
const matchXYScrollHeight = () => {
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;
  const contentWidth = xScrollContent.offsetWidth;

  // new body height approximates content width
  // adjusted for difference between window width/height
  const newHeight = contentWidth - (winWidth - winHeight);

  // set the style
  body.style.height = newHeight + "px";
};

/** decide target y-scroll when x-scrolling */
const yMatchX = () => {
  //do nothing on mobile
  if (window.innerWidth <= 580) return false;

  const scrollLeft = xScrollContainer.scrollLeft;

  document.documentElement.scrollTop = scrollLeft;
};

const xMatchY = () => {
  //const maxScroll = scrollHeight - winHeight;
  //do nothing on mobile
  if (window.innerWidth <= 580) return false;

  const scrollTop = window.scrollY;

  xScrollContainer.scrollLeft = scrollTop;
};

const body = document.body;
const xScrollContainer = document.getElementById("x-scroll-container");
const xScrollContent = document.getElementById("x-scroll-content");

matchXYScrollHeight();
xMatchY();
yMatchX();

window.addEventListener("scroll", () => requestAnimationFrame(xMatchY));

xScrollContainer.addEventListener("scroll", () =>
  requestAnimationFrame(yMatchX)
);
