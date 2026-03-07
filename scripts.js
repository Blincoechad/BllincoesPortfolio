

'use strict';

/*  hamburger menu  */
(function () {
  let btn  = document.getElementById('hamburger');
  let menu = document.getElementById('navLinks');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    let open = menu.classList.toggle('is-open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  // close when a link is tapped
  menu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // close on outside click
  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();


/*  contact form validation  */
(function () {
  let form    = document.getElementById('contactForm');
  let success = document.getElementById('formSuccess');
  let error   = document.getElementById('formError');
  if (!form) return;

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function setError(id, msg) {
    let field = document.getElementById(id);
    let err   = document.getElementById(id + '-error');
    if (field) field.classList.add('error');
    if (err)   err.textContent = msg;
  }

  function clearError(id) {
    let field = document.getElementById(id);
    let err   = document.getElementById(id + '-error');
    if (field) field.classList.remove('error');
    if (err)   err.textContent = '';
  }

  // inline validation on blur
  ['name', 'email', 'message'].forEach(function (id) {
    let field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('blur', function () {
      if (!field.value.trim()) {
        setError(id, 'This field is required.');
      } else if (id === 'email' && !isValidEmail(field.value.trim())) {
        setError(id, 'Please enter a valid email address.');
      } else {
        clearError(id);
      }
    });
    field.addEventListener('input', function () {
      if (field.value.trim()) clearError(id);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    if (error) {
      error.hidden = true;
      error.textContent = '';
    }

    ['name', 'email', 'message'].forEach(clearError);

    var name    = document.getElementById('name');
    var email   = document.getElementById('email');
    var message = document.getElementById('message');

    if (!name || !name.value.trim())       { setError('name', 'Please enter your full name.'); valid = false; }
    if (!email || !email.value.trim())     { setError('email', 'Please enter your email.'); valid = false; }
    else if (!isValidEmail(email.value.trim())) { setError('email', 'Please enter a valid email.'); valid = false; }
    if (!message || !message.value.trim()) { setError('message', 'Please enter a message.'); valid = false; }

    if (!valid) {
      if (error) {
        error.textContent = 'Please fill out the required fields marked with a red asterisk.';
        error.hidden = false;
        error.focus();
      }
      var firstErr = form.querySelector('.error');
      if (firstErr) firstErr.focus();
      return;
    }

    // succcess - add a success message
    form.reset();
    if (success) {
      success.hidden = false;
      success.focus();
      setTimeout(function () { success.hidden = true; }, 6000);
    }
  });
})();


/*  simple image slider  */
(function () {
  var sliders = document.querySelectorAll('.image-slider');
  if (!sliders.length) return;

  sliders.forEach(function (slider) {
    var track = slider.querySelector('.slider-track');
    var slides = slider.querySelectorAll('.slide');
    var prev = slider.querySelector('.slider-btn.prev');
    var next = slider.querySelector('.slider-btn.next');

    if (!track || !slides.length || !prev || !next) return;

    var index = 0;
    var interval = 2500;
    var timer;

    function update() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', i !== index);
      });
    }

    function startAutoPlay() {
      stopAutoPlay();
      timer = setInterval(function () {
        index = (index + 1) % slides.length;
        update();
      }, interval);
    }

    function stopAutoPlay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    prev.addEventListener('click', function () {
      index = (index - 1 + slides.length) % slides.length;
      update();
      startAutoPlay();
    });

    next.addEventListener('click', function () {
      index = (index + 1) % slides.length;
      update();
      startAutoPlay();
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    update();
    startAutoPlay();
  });
})();