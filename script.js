(function () {
  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));

  function showScreen(name) {
    screens.forEach(function (el) {
      var active = el.dataset.screen === name;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-hidden', String(!active));
    });
  }

  // initial screen
  showScreen('home');

  var ARC_DURATION = 950;
  var arcBusy = false;

  function playPauseArc(onDone) {
    var trigger = document.querySelector('#screen-home .pause-trigger');
    if (!trigger || arcBusy) { onDone(); return; }
    arcBusy = true;
    trigger.classList.add('is-arcing');
    setTimeout(function () {
      onDone();
      setTimeout(function () {
        trigger.classList.remove('is-arcing');
        arcBusy = false;
      }, 400);
    }, ARC_DURATION);
  }

  // "Take a breath": the bubble slowly expands to fill the screen, then holds
  // a slow drifting rainbow hue until the user ends the pause themselves.
  var BREATHE_EXPAND_DELAY = 1800;
  var breatheExpandTimer = null;
  var breatheBubbleEl = document.querySelector('.hero-bubble-big');

  function enterBreathe() {
    var screen = document.getElementById('screen-breathe');
    screen.classList.remove('is-expanding', 'is-immersed');
    clearTimeout(breatheExpandTimer);

    if (breatheBubbleEl) {
      breatheBubbleEl.removeEventListener('transitionend', onBreatheExpandEnd);
      breatheBubbleEl.addEventListener('transitionend', onBreatheExpandEnd);
    }

    breatheExpandTimer = setTimeout(function () {
      screen.classList.add('is-expanding');
    }, BREATHE_EXPAND_DELAY);
  }

  function onBreatheExpandEnd(e) {
    if (e.propertyName !== 'transform') return;
    document.getElementById('screen-breathe').classList.add('is-immersed');
  }

  function exitBreathe() {
    clearTimeout(breatheExpandTimer);
    var screen = document.getElementById('screen-breathe');
    screen.classList.remove('is-expanding', 'is-immersed');
  }

  document.addEventListener('click', function (e) {
    var navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      showScreen(navBtn.dataset.nav);
      return;
    }

    var actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;

    switch (actionBtn.dataset.action) {
      case 'start-vu':
        if (arcBusy) return;
        playPauseArc(function () { showScreen('outside'); });
        break;
      case 'go-breathe':
        showScreen('breathe');
        enterBreathe();
        break;
      case 'end-breathe':
        exitBreathe();
        showScreen('feel');
        break;
      case 'confirm-feel':
        showScreen('home');
        resetFeelOptions();
        break;
      case 'start-group':
        showScreen('outside');
        break;
    }
  });

  // "How do you feel" single-select options
  var options = document.querySelectorAll('.option-pill');
  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      options.forEach(function (o) { o.setAttribute('aria-checked', 'false'); });
      opt.setAttribute('aria-checked', 'true');
    });
  });

  function resetFeelOptions() {
    options.forEach(function (o) { o.setAttribute('aria-checked', 'false'); });
  }
})();
