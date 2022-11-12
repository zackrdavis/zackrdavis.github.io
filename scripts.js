var bodyScroll = 0;
var matched = false;

function matchHeightToWidth() {
  if (
    $("body").height() !==
    $("ul").width() - ($(window).width() - $(window).height())
  ) {
    $("body").height(
      $("ul").width() - ($(window).width() - $(window).height())
    );
  }
}

// set where vertical scroll should jump to to match horz position
function setBodyScroll() {
  //do nothing on mobile
  if ($(window).width() <= 580) {
    return;
  }

  bodyScroll = $(".scroll-container").scrollLeft();
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

  $(".scroll-container").scrollLeft($(window).scrollTop());

  matched = true;
}

$(document).ready(function () {
  scrollerMatchBody();
  matchHeightToWidth();
});

$(window).on("scroll", scrollerMatchBody);
$(".scroll-container").on("scroll", setBodyScroll);
