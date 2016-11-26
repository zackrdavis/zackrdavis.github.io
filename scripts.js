function matchHeightToWidth() {
  if($('body').height() !== $('ul').width() - ($(window).width() - $(window).height())) {
    $('body').height($('ul').width() - ($(window).width() - $(window).height()));
  }
}

function scrollerMatchBody() {
  if($(window).width() <= 580) {
    return;
  }

  matchHeightToWidth();

  $('.scroll-container').scrollLeft($(window).scrollTop());
}

function bodyMatchScroller() {
  if($(window).width() <= 580) {
    return;
  }

  matchHeightToWidth();

  if($('.scroll-container').scrollLeft() !== $(window).scrollTop()) {
    $(window).scrollTop($('.scroll-container').scrollLeft())
  }
}

$(document).ready(function() {
  scrollerMatchBody();
})

$(window).on('scroll', scrollerMatchBody);

$(window).on('mousewheel', bodyMatchScroller);
