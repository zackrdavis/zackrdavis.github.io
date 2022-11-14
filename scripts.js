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
const setBodyScroll = () => {
  const winWidth = window.innerWidth;

  //do nothing on mobile
  if (winWidth < 580) return false;

  const scrollLeft = xScrollContainer.scrollLeft;

  bodyScroll = scrollLeft;

  window.scrollTo = bodyScroll;

  matched = false;
};

const scrollerMatchBody = () => {
  const scrollHeight = body.scrollHeight;
  const scrollTop = window.scrollY;
  const winHeight = window.innerHeight;
  const winWidth = window.innerWidth;

  const maxScroll = scrollHeight - winHeight;

  //do nothing on mobile
  if (winWidth <= 580 || scrollTop >= maxScroll) {
    return;
  }

  if (!matched) {
    window.scrollTop = bodyScroll;
  }

  xScrollContainer.scrollLeft = scrollTop;

  matched = true;
};

var bodyScroll = 0;
var matched = false;

const body = document.body;
const xScrollContainer = document.getElementById("x-scroll-container");
const xScrollContent = document.getElementById("x-scroll-content");

scrollerMatchBody();
matchXYScrollHeight();

window.addEventListener("scroll", scrollerMatchBody);
xScrollContainer.addEventListener("scroll", setBodyScroll);
