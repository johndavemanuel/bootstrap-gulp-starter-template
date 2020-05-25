"use strict";
$.fn.autoPadding = function ($settings) {
  var $config = {
      source: null,
    },
    $target = $(this);

  if ($settings) jQuery.extend($config, $settings);

  $(this).css({
    paddingTop: $config.source.innerHeight() + 'px',
  });

  $(window).resize(function () {
    $target.css({
      paddingTop: $config.source.innerHeight() + 'px',
    });
  });
};
