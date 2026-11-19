(function () {
    'use strict';

    var MIN_AGE = 1;
    var MAX_AGE = 120;
    var AQUAPARK_MAX_AGE = 15;
    var CLUB_MAX_AGE = 35;

    var promoWrapper = document.getElementById('promoWrapper');
    var modal = document.getElementById('welcomeModal');
    var form = document.getElementById('welcomeForm');
    var input = document.getElementById('guestAge');
    var error = document.getElementById('guestAgeError');
    var showAllFeedbacks = document.getElementById('showAllFeedbacks');
    var hiddenFeedbacks = document.getElementById('hiddenFeedbacks');
    var lastFocusedElement = null;

    function clearPromoTheme() {
        promoWrapper.classList.remove('aquapark', 'club');
    }

    function applyAgeTheme(age) {
        clearPromoTheme();

        if (age <= AQUAPARK_MAX_AGE) {
            promoWrapper.classList.add('aquapark');
        } else if (age <= CLUB_MAX_AGE) {
            promoWrapper.classList.add('club');
        }
    }

    function parseAge(value) {
        var age = value.trim();

        if (!age) {
            return { error: 'Пожалуйста, введите возраст' };
        }

        if (!/^\d+$/.test(age)) {
            return { error: 'Введите возраст целым числом от ' + MIN_AGE + ' до ' + MAX_AGE };
        }

        var number = parseInt(age, 10);

        if (number < MIN_AGE || number > MAX_AGE) {
            return { error: 'Введите возраст от ' + MIN_AGE + ' до ' + MAX_AGE };
        }

        return { value: number };
    }

    function showError(message) {
        error.textContent = message;
        error.hidden = false;
        input.classList.add('welcome-modal__input_invalid');
        input.setAttribute('aria-invalid', 'true');
    }

    function hideError() {
        error.hidden = true;
        input.classList.remove('welcome-modal__input_invalid');
        input.removeAttribute('aria-invalid');
    }

    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.hidden = false;
        document.body.classList.add('modal-open');

        window.requestAnimationFrame(function () {
            input.focus();
        });
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        hideError();

        if (lastFocusedElement && lastFocusedElement !== document.body) {
            lastFocusedElement.focus();
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        var result = parseAge(input.value);

        if (result.error) {
            showError(result.error);
            input.focus();
            return;
        }

        applyAgeTheme(result.value);
        closeModal();
    }

    function revealFeedbacks() {
        if (!hiddenFeedbacks || !hiddenFeedbacks.classList.contains('hidden')) {
            return;
        }

        hiddenFeedbacks.classList.remove('hidden');
        showAllFeedbacks.hidden = true;
        showAllFeedbacks.setAttribute('aria-expanded', 'true');
        hiddenFeedbacks.focus();
    }

    modal.addEventListener('click', function (event) {
        if (event.target.hasAttribute('data-welcome-close')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (modal.hidden) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        var focusable = modal.querySelectorAll('button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])');

        if (!focusable.length) {
            return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    input.addEventListener('input', function () {
        if (!error.hidden) {
            hideError();
        }
    });

    form.addEventListener('submit', handleSubmit);
    showAllFeedbacks.addEventListener('click', revealFeedbacks);

    clearPromoTheme();
    openModal();
})();
