var bodyScroll = 0;
var matched = false;

const body = document.body;
const xScrollContainer = document.getElementById("x-scroll-container");
const xScrollContent = document.getElementById("x-scroll-content");

/** Force window's Y scroll to match xScrollContainer's X scroll */
function matchXYScrollHeight() {
  // adjust for difference between window width and height
  const windowXYDiff = window.innerWidth - window.innerHeight;

  // new body height approximates xScrollContent width, with adjustment
  const newHeight = xScrollContent.offsetWidth - windowXYDiff;

  // set the style
  body.style.height = newHeight + "px";
}

// set where vertical scroll should jump to to match horz position
function setBodyScroll() {
  //do nothing on mobile
  if (window.innerWidth <= 580) {
    return;
  }

  bodyScroll = $("#x-scroll-container").scrollLeft();
  matched = false;
}

function scrollerMatchBody() {
  const maxScroll = $("body").get(0).scrollHeight - $(window).height();

  //do nothing on mobile
  if ($(window).width() <= 580 || $(window).scrollTop() >= maxScroll) {
    return;
  }

  if (!matched) {
    $(window).scrollTop(bodyScroll);
  }

  $("#x-scroll-container").scrollLeft($(window).scrollTop());

  matched = true;
}

$(document).ready(function () {
  scrollerMatchBody();
  matchXYScrollHeight();
});

$(window).on("scroll", scrollerMatchBody);
$("#x-scroll-container").on("scroll", setBodyScroll);
