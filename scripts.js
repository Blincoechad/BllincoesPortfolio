// Supabase code for my contact form
// Supabase setup
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient(
  'https://xxjjwbaovtbylknwgbzt.supabase.co',
  'sb_publishable_ggiWZHIFBs_QdJy2bgPJGw_cP2dUoza'
)

// Vercel Speed Insights
import { injectSpeedInsights } from 'https://cdn.jsdelivr.net/npm/@vercel/speed-insights@latest/dist/index.mjs';

// Initialize Speed Insights
injectSpeedInsights();

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


/*  contact form validation + supabase  */

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

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    let valid = true;

    if (error) { error.hidden = true; error.textContent = ''; }
    ['name', 'email', 'message'].forEach(clearError);

    let nameVal    = document.getElementById('name').value.trim();
    let emailVal   = document.getElementById('email').value.trim();
    let messageVal = document.getElementById('message').value.trim();
    let projectType = document.getElementById('project-type').value;

    if (!nameVal)                     { setError('name', 'Please enter your full name.'); valid = false; }
    if (!emailVal)                    { setError('email', 'Please enter your email.'); valid = false; }
    else if (!isValidEmail(emailVal)) { setError('email', 'Please enter a valid email.'); valid = false; }
    if (!messageVal)                  { setError('message', 'Please enter a message.'); valid = false; }

    if (!valid) {
      if (error) {
        error.textContent = 'Please fill out the required fields marked with a red asterisk.';
        error.hidden = false;
      }
      return;
    }

    // submit to supabase
    const { error: sbError } = await supabase
      .from('contact_submissions')
      .insert([{ name: nameVal, email: emailVal, project_type: projectType, message: messageVal }])

    if (sbError) {
      if (error) {
        error.textContent = 'You have reached the message limit for the day Please try again in 24 hours, Thanks!';
        error.hidden = false;
      }
    } else {
      form.reset();
      if (success) {
        success.hidden = false;
        success.focus();
        setTimeout(function () { success.hidden = true; }, 6000);
      }
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

/*  gallery lightbox for figure images */
(function () {
  var galleryImages = document.querySelectorAll('.gallery-grid img, .gallery-grid video');
  if (!galleryImages.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');

  var content = document.createElement('div');
  content.className = 'lightbox-content';

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close image viewer');
  closeBtn.textContent = '×';

  var largeImage = document.createElement('img');
  largeImage.alt = '';

  var largeVideo = document.createElement('video');
  largeVideo.loop = true;
  largeVideo.playsInline = true;
  largeVideo.controls = true;
  largeVideo.style.display = 'none';

  var splitContainer = document.createElement('div');
  splitContainer.className = 'lightbox-split';
  splitContainer.style.display = 'none';

  var splitImageA = document.createElement('img');
  var splitImageB = document.createElement('img');
  splitContainer.appendChild(splitImageA);
  splitContainer.appendChild(splitImageB);

  var captionElem = document.createElement('p');
  captionElem.className = 'lightbox-caption';

  content.appendChild(closeBtn);
  content.appendChild(largeImage);
  content.appendChild(largeVideo);
  content.appendChild(splitContainer);
  content.appendChild(captionElem);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  function openLightbox(src, alt, caption) {
    largeImage.src = src;
    largeImage.alt = alt || '';
    largeImage.style.display = '';
    largeVideo.style.display = 'none';
    largeVideo.pause();
    splitContainer.style.display = 'none';
    captionElem.textContent = caption || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function openVideoLightbox(src, caption) {
    largeVideo.src = src;
    largeVideo.muted = false;
    largeVideo.style.display = '';
    largeVideo.play();
    largeImage.style.display = 'none';
    largeImage.src = '';
    splitContainer.style.display = 'none';
    captionElem.textContent = caption || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function openSplitLightbox(srcA, srcB, caption) {
    splitImageA.src = srcA;
    splitImageB.src = srcB;
    splitImageA.alt = 'Before image';
    splitImageB.alt = 'After image';
    largeImage.src = '';
    largeImage.style.display = 'none';
    largeVideo.style.display = 'none';
    largeVideo.pause();
    splitContainer.style.display = 'flex';
    captionElem.textContent = caption || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    largeImage.src = '';
    largeVideo.pause();
    largeVideo.muted = true;
    largeVideo.src = '';
    splitImageA.src = '';
    splitImageB.src = '';
  }

  galleryImages.forEach(function (el) {
    var splitImageParent = el.closest('.split-image');
    var figure = el.closest('figure');
    var caption = figure && figure.querySelector('figcaption') ? figure.querySelector('figcaption').textContent : '';

    el.setAttribute('tabindex', '0');
    el.style.cursor = 'pointer';

    // split image code
    if (splitImageParent) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var sharedFigure = el.closest('figure');
        var images = sharedFigure.querySelectorAll('.split-image__item img');
        if (images.length >= 2) {
          openSplitLightbox(images[0].src, images[1].src, caption);
        }
      });

      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          var sharedFigure = el.closest('figure');
          var images = sharedFigure.querySelectorAll('.split-image__item img');
          if (images.length >= 2) {
            openSplitLightbox(images[0].src, images[1].src, caption);
          }
        }
      });
      return;
    }

    // video handling code
    if (el.tagName === 'VIDEO') {
      el.addEventListener('click', function () {
        openVideoLightbox(el.querySelector('source') ? el.querySelector('source').src : el.src, caption);
      });

      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openVideoLightbox(el.querySelector('source') ? el.querySelector('source').src : el.src, caption);
        }
      });
      return;
    }

    // image handling code
    el.addEventListener('click', function () {
      openLightbox(el.src, el.alt, caption);
    });

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(el.src, el.alt, caption);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeLightbox();
  });
})();




