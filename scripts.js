var bodyScroll = 0;
var matched = false;

function matchHeightToWidth() {
  $("body").height(
    $(".x-scroll-content").width() - ($(window).width() - $(window).height())
  );
}

// set where vertical scroll should jump to to match horz position
function setBodyScroll() {
  //do nothing on mobile
  if ($(window).width() <= 580) {
    return;
  }

  bodyScroll = $(".x-scroll-container").scrollLeft();
  matched = false;
}

function scrollerMatchBody() {
  //do nothing on mobile
  if ($(window).width() <= 580) {
    return;
  }

  if (!matched) {
    $(window).scrollTop(bodyScroll);
  }

  $(".x-scroll-container").scrollLeft($(window).scrollTop());

  matched = true;
}

$(document).ready(function () {
  scrollerMatchBody();
  matchHeightToWidth();
});

$(window).on("scroll", scrollerMatchBody);
$(".x-scroll-container").on("scroll", setBodyScroll);
