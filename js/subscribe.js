(function ($) {
    'use strict';

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var $modal = $('#subscribeModal');
    var $overlay = $('#subscribeOverlay');
    var $dialog = $('#subscribeDialog');
    var $openButton = $('#subscribeButton');
    var $closeButtons = $('[data-subscribe-close]');
    var $form = $('#subscribeForm');
    var $email = $('#subscribeEmail');
    var $error = $('#subscribeEmailError');
    var $success = $('#subscribeSuccess');
    var lastFocusedElement = null;

    function showError() {
        $error.removeAttr('hidden');
        $email
            .addClass('welcome-modal__input_invalid')
            .attr('aria-invalid', 'true');
    }

    function hideError() {
        $error.attr('hidden', 'hidden');
        $email
            .removeClass('welcome-modal__input_invalid')
            .removeAttr('aria-invalid');
    }

    function resetModal() {
        $form[0].reset();
        $form.removeAttr('hidden');
        $success.attr('hidden', 'hidden');
        hideError();
    }

    function openModal() {
        lastFocusedElement = document.activeElement;
        resetModal();

        $modal.removeAttr('hidden');
        $('body').addClass('subscribe-open');

        window.requestAnimationFrame(function () {
            $email.trigger('focus');
        });
    }

    function closeModal() {
        if ($modal.is('[hidden]')) {
            return;
        }

        $modal.attr('hidden', 'hidden');
        $('body').removeClass('subscribe-open');
        resetModal();

        if (lastFocusedElement && lastFocusedElement !== document.body) {
            lastFocusedElement.focus();
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        var email = $.trim($email.val());

        if (!EMAIL_PATTERN.test(email)) {
            showError();
            $email.trigger('focus');
            return;
        }

        hideError();
        $form.attr('hidden', 'hidden');
        $success.removeAttr('hidden');

        window.requestAnimationFrame(function () {
            $success.trigger('focus');
        });
    }

    function trapFocus(event) {
        if ($modal.is('[hidden]') || event.key !== 'Tab') {
            return;
        }

        var $focusable = $modal
            .find('button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])')
            .filter(':visible');

        if (!$focusable.length) {
            return;
        }

        var first = $focusable[0];
        var last = $focusable[$focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    $openButton.on('click', openModal);
    $closeButtons.on('click', closeModal);
    $overlay.on('click', closeModal);

    $dialog.on('click', function (event) {
        event.stopPropagation();
    });

    $email.on('input', hideError);
    $form.on('submit', handleSubmit);

    $(document).on('keydown', function (event) {
        if ($modal.is('[hidden]')) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
            return;
        }

        trapFocus(event);
    });
})(jQuery);
