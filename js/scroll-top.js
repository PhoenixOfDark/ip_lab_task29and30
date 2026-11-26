(function ($) {
    'use strict';

    var SHOW_OFFSET = 300;
    var SCROLL_DURATION = 700;

    var $button = $('#scrollTopButton');
    var $window = $(window);
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var isVisible = false;

    function toggleButton() {
        var shouldShow = $window.scrollTop() > SHOW_OFFSET;

        if (shouldShow === isVisible) {
            return;
        }

        isVisible = shouldShow;

        $button
            .toggleClass('up_button_visible', shouldShow)
            .attr('aria-hidden', shouldShow ? 'false' : 'true')
            .attr('tabindex', shouldShow ? '0' : '-1');
    }

    function scrollToTop() {
        $('html, body')
            .stop(true)
            .animate({ scrollTop: 0 }, reduceMotion.matches ? 0 : SCROLL_DURATION);
    }

    $window.on('scroll', toggleButton);
    $button.on('click', scrollToTop);

    toggleButton();
})(jQuery);
