/* No storefront dependency: sections also initialize after theme-editor reload. */
class RaceworksFitment extends HTMLElement {
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.fields = [...this.querySelectorAll('select[data-field]')];
    this.rows = [...this.querySelectorAll('[data-vehicle-data] li')].map(
      (node) =>
        new Map(
          [...node.attributes]
            .filter((attr) => attr.name.startsWith('data-'))
            .map((attr) => [attr.name.slice(5), attr.value]),
        ),
    );
    this.form = this.querySelector('form');
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.status = this.querySelector('[aria-live]');
    this.fields.forEach((select, index) =>
      select.addEventListener('change', () => this.refresh(index + 1), { signal: this.controller.signal }),
    );
    this.form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        if (!this.form.reportValidity()) return;
        const row = this.matchingRows(this.fields.length)[0];
        if (!row) return;
        const destination = new URL(row.get('destination'), location.origin);
        if (!['https:', 'http:'].includes(destination.protocol)) return;
        location.assign(destination.href);
      },
      { signal: this.controller.signal },
    );
    this.refresh(0);
  }

  disconnectedCallback() {
    this.controller?.abort();
  }

  matchingRows(depth) {
    return this.rows.filter((row) =>
      this.fields.slice(0, depth).every((select) => select.value && row.get(select.dataset.field) === select.value),
    );
  }

  refresh(start) {
    this.fields.slice(start).forEach((select, offset) => {
      const index = start + offset;
      const options = [...new Set(this.matchingRows(index).map((row) => row.get(select.dataset.field)))]
        .filter(Boolean)
        .sort((a, b) =>
          select.dataset.field === 'year' ? b.localeCompare(a, undefined, { numeric: true }) : a.localeCompare(b),
        );
      select.replaceChildren(new Option(select.getAttribute('aria-label'), ''));
      options.forEach((value) => select.add(new Option(value, value)));
      select.disabled = options.length === 0;
    });
    this.submitButton.disabled = !this.fields.every((select) => select.value);
    this.status.textContent = this.submitButton.disabled
      ? ''
      : 'Check the product’s full fitment requirements before ordering.';
  }
}
if (!customElements.get('rw-fitment')) customElements.define('rw-fitment', RaceworksFitment);

document.addEventListener('click', (event) => {
  const guideLink = event.target.closest('[data-guide-open]');
  if (guideLink) {
    const target = document.getElementById(guideLink.hash.slice(1));
    if (target) target.open = true;
  }
  document.querySelectorAll('.rw-mobile-nav[open], .rw-nav-dropdown[open]').forEach((menu) => {
    const insideMobileHeader =
      menu.classList.contains('rw-mobile-nav') && menu.closest('.rw-header').contains(event.target);
    if ((!menu.contains(event.target) && !insideMobileHeader) || event.target.closest('a')) menu.open = false;
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const openMenus = [...document.querySelectorAll('.rw-mobile-nav[open], .rw-nav-dropdown[open]')];
  openMenus.reverse().forEach((menu) => {
    menu.open = false;
    menu.querySelector('summary').focus();
  });
});

class BxrCarousel extends HTMLElement {
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.slides = [...this.querySelectorAll('[data-slide]')];
    this.dots = [...this.querySelectorAll('[data-slide-to]')];
    this.controls = this.querySelector('.rw-carousel-controls');
    if (this.slides.length < 2 || !this.controls) return;
    this.index = 0;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.playing = this.dataset.autoplay === 'true' && !this.motion.matches && !window.Shopify?.designMode;
    this.controls.hidden = false;
    this.interval = Math.max(5000, Number(this.dataset.interval) || 7000);
    const listen = (target, name, handler) =>
      target.addEventListener(name, handler, { signal: this.controller.signal });
    this.dots.forEach((dot, index) => listen(dot, 'click', () => this.select(index, true)));
    this.playback = this.querySelector('[data-playback]');
    if (this.playback)
      listen(this.playback, 'click', () => {
        this.playing = !this.playing;
        this.updatePlayback();
        this.schedule();
      });
    listen(this, 'mouseenter', () => {
      this.hovering = true;
      this.schedule();
    });
    listen(this, 'mouseleave', () => {
      this.hovering = false;
      this.schedule();
    });
    listen(this, 'focusin', (event) => {
      if (event.target === this.playback) return;
      this.playing = false;
      this.updatePlayback();
      this.schedule();
    });
    listen(this, 'keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      this.select(this.index + (event.key === 'ArrowRight' ? 1 : -1), true);
    });
    listen(this, 'touchstart', (event) => {
      const touch = event.changedTouches[0];
      this.touchX = touch.clientX;
      this.touchY = touch.clientY;
      clearTimeout(this.timer);
    });
    listen(this, 'touchend', (event) => {
      const touch = event.changedTouches[0];
      const distance = touch.clientX - this.touchX;
      if (Math.abs(distance) > 50 && Math.abs(distance) > Math.abs(touch.clientY - this.touchY) * 1.5) {
        this.select(this.index + (distance < 0 ? 1 : -1), true);
      } else this.schedule();
    });
    listen(document, 'visibilitychange', () => this.schedule());
    listen(this.motion, 'change', () => {
      if (this.motion.matches) this.playing = false;
      this.updatePlayback();
      this.schedule();
    });
    listen(document, 'shopify:block:select', (event) => {
      const index = this.slides.findIndex((slide) => slide.dataset.blockId === event.detail.blockId);
      if (index >= 0) this.select(index, true);
    });
    this.observer = new IntersectionObserver(([entry]) => {
      this.offscreen = !entry.isIntersecting;
      this.schedule();
    });
    this.observer.observe(this);
    this.updatePlayback();
    this.schedule();
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.observer?.disconnect();
    clearTimeout(this.timer);
  }

  select(requestedIndex, manual = false) {
    this.index = (requestedIndex + this.slides.length) % this.slides.length;
    // If a keyboard user was on a slide link, keep focus in a visible control.
    if (this.slides.some((slide, index) => index !== this.index && slide.contains(document.activeElement))) {
      this.dots[this.index].focus();
    }
    this.slides.forEach((slide, index) => {
      slide.hidden = index !== this.index;
      slide.inert = index !== this.index;
    });
    this.dots.forEach((dot, index) => {
      if (index === this.index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (manual) {
      this.playing = false;
      this.querySelector('[data-slide-status]').textContent = `Slide ${this.index + 1} of ${this.slides.length}`;
    }
    this.updatePlayback();
    this.schedule();
  }

  updatePlayback() {
    if (!this.playback) return;
    this.playback.querySelector('[data-pause-icon]').hidden = !this.playing;
    this.playback.querySelector('[data-play-icon]').hidden = this.playing;
    this.playback.setAttribute('aria-label', this.playing ? 'Pause slideshow' : 'Play slideshow');
  }

  schedule() {
    clearTimeout(this.timer);
    if (!this.playing || this.hovering || this.offscreen || document.hidden) return;
    this.timer = setTimeout(() => this.select(this.index + 1), this.interval);
  }
}
if (!customElements.get('bxr-carousel')) customElements.define('bxr-carousel', BxrCarousel);
