/* No storefront dependency: sections also initialize after theme-editor reload. */
class RaceworksFitment extends HTMLElement {
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.fields = [...this.querySelectorAll('[data-field]')];
    this.rows = [...this.querySelectorAll('[data-vehicle-data] li')].map(
      (node) =>
        new Map(
          [...node.attributes]
            .filter((attr) => attr.name.startsWith('data-'))
            .map((attr) => [attr.name.slice(5), attr.value]),
        ),
    );
    this.form = this.querySelector('form');
    this.result = this.querySelector('[data-fitment-result]');
    this.status = this.querySelector('[data-fitment-status]');
    this.results = this.querySelector('[data-fitment-results]');
    this.fields.forEach((select, index) =>
      select.addEventListener('input', () => this.refresh(index + 1), { signal: this.controller.signal }),
    );
    this.form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        if (!this.form.reportValidity()) return;
        this.showResults();
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
      this.fields.slice(0, depth).every((field) => {
        const value = this.normalize(field.value);
        return (!value && field.dataset.field === 'trim') || this.normalize(row.get(field.dataset.field)) === value;
      }),
    );
  }

  refresh(start) {
    this.result.hidden = true;
    this.fields.slice(start).forEach((select, offset) => {
      const index = start + offset;
      if (!select.list) return;
      const options = [...new Set(this.matchingRows(index).map((row) => row.get(select.dataset.field)))]
        .filter(Boolean)
        .sort((a, b) =>
          select.dataset.field === 'year' ? b.localeCompare(a, undefined, { numeric: true }) : a.localeCompare(b),
        );
      select.list.replaceChildren(...options.map((value) => new Option(value, value)));
    });
  }

  normalize(value = '') {
    return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
  }

  showResults() {
    this.results.replaceChildren();
    const destinations = new Set();
    this.matchingRows(this.fields.length).forEach((row) => {
      if (!row.get('destination')?.trim()) return;
      let destination;
      try { destination = new URL(row.get('destination'), location.origin); } catch { return; }
      if (!['https:', 'http:'].includes(destination.protocol) || destination.origin !== location.origin) return;
      const label = ['year', 'make', 'model', 'trim'].map((key) => row.get(key)).join(' ');
      const identity = `${label}:${destination.href}`;
      if (destinations.has(identity)) return;
      destinations.add(identity);
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'rw-text-link';
      link.href = destination.href;
      link.textContent = `View parts for ${label}`;
      item.append(link);
      this.results.append(item);
    });
    this.status.textContent = destinations.size
      ? 'Catalog matches found. Choose your exact configuration and check the full part specifications.'
      : 'We do not have a verified match for this vehicle yet. Send us your setup details before choosing a part.';
    const support = new URL(this.dataset.supportUrl, location.origin);
    support.searchParams.set('vehicle', this.fields.map((field) => field.value.trim()).filter(Boolean).join(' '));
    support.hash = 'contact';
    this.querySelector('[data-fitment-support]').href = support.href;
    this.result.hidden = false;
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
    if (!this.slides.length) return;
    this.index = 0;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.playing = this.dataset.autoplay === 'true' && !this.motion.matches && !window.Shopify?.designMode;
    if (this.controls) this.controls.hidden = false;
    this.mobile = matchMedia('(max-width: 749px)');
    this.videos = [...this.querySelectorAll('video')];
    this.interval = Math.max(5000, Number(this.dataset.interval) || 7000);
    const listen = (target, name, handler) =>
      target.addEventListener(name, handler, { signal: this.controller.signal });
    listen(this.mobile, 'change', () => this.schedule());
    this.videos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      listen(video, 'playing', () => video.parentElement.classList.add('is-ready'));
      listen(video, 'error', () => video.parentElement.classList.remove('is-ready'));
    });
    this.dots.forEach((dot, index) => listen(dot, 'click', () => this.select(index, true)));
    this.querySelectorAll('[data-slide-step]').forEach((button) =>
      listen(button, 'click', () => this.select(this.index + Number(button.dataset.slideStep), true)),
    );
    this.playback = this.querySelector('[data-playback]');
    if (this.playback)
      listen(this.playback, 'click', () => {
        this.playing = !this.playing;
        this.updatePlayback();
        this.schedule();
      });
    listen(this, 'pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      this.hovering = true;
      this.schedule();
    });
    listen(this, 'pointerleave', (event) => {
      if (event.pointerType !== 'mouse') return;
      this.hovering = false;
      this.schedule();
    });
    listen(this, 'focusin', (event) => {
      this.focused = event.target.matches(':focus-visible') && !this.playback?.contains(event.target);
      this.schedule();
    });
    listen(this, 'focusout', (event) => {
      this.focused = this.contains(event.relatedTarget) && event.relatedTarget.matches(':focus-visible') && !this.playback?.contains(event.relatedTarget);
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
    this.videos?.forEach((video) => video.pause());
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
    if (manual && this.querySelector('[data-slide-status]')) {
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
    const running = this.playing && !this.hovering && !this.focused && !this.offscreen && !document.hidden;
    this.slides.forEach((slide, index) => { slide.dataset.mediaRunning = String(running && index === this.index); });
    this.videos.forEach((video) => {
      const layout = video.parentElement.dataset.videoLayout;
      const visible = layout === 'all' || (layout === 'mobile') === this.mobile.matches;
      const active = running && visible && video.closest('[data-slide]') === this.slides[this.index];
      if (active && video.paused) {
        video.play().catch(() => { video.parentElement.classList.remove('is-ready'); });
      } else if (!active) video.pause();
    });
    if (running && this.slides.length > 1) this.timer = setTimeout(() => this.select(this.index + 1), this.interval);
  }
}
if (!customElements.get('bxr-carousel')) customElements.define('bxr-carousel', BxrCarousel);

// Carry only the visitor's vehicle/topic into the contact form. Never submit it automatically.
function prefillBxrContact() {
  const form = document.querySelector('.bxr-contact-form');
  if (!form) return;
  const query = new URLSearchParams(location.search);
  const vehicle = query.get('vehicle')?.slice(0, 300);
  const topic = query.get('topic');
  const message = form.querySelector('textarea[name="contact[body]"]');
  const topicField = form.querySelector('[name="contact[Topic]"]');
  if (vehicle && message && !message.value) message.value = `Vehicle: ${vehicle}\n\nPart / wheel specifications:\n\nMy question:\n`;
  if (topic && topicField && [...topicField.options].some((option) => option.value === topic)) topicField.value = topic;
}
prefillBxrContact();
document.addEventListener('shopify:section:load', prefillBxrContact);

class BxrDialog extends HTMLElement {
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.dialog = this.querySelector('dialog');
    const signal = this.controller.signal;
    this.addEventListener('click', (event) => {
      if (event.target.closest('[data-bxr-close]')) this.dialog.close();
      if (event.target !== this.dialog) return;
      const bounds = this.dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) this.dialog.close();
    }, { signal });
    this.dialog.addEventListener('close', () => {
      if (!document.querySelector('.bxr-drawer[open]')) document.body.classList.remove('bxr-dialog-open');
      if (this.opener?.isConnected) this.opener.focus({ preventScroll: true });
    }, { signal });
  }

  show(opener) {
    if (this.dialog.open) return;
    this.opener = opener;
    document.querySelectorAll('.rw-mobile-nav[open]').forEach((menu) => { menu.open = false; });
    this.dialog.showModal();
    document.body.classList.add('bxr-dialog-open');
  }

  disconnectedCallback() {
    this.controller?.abort();
    if (!document.querySelector('.bxr-drawer[open]')) document.body.classList.remove('bxr-dialog-open');
  }
}
if (!customElements.get('bxr-dialog')) customElements.define('bxr-dialog', BxrDialog);

document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-bxr-open]');
  if (opener) document.getElementById(opener.dataset.bxrOpen)?.closest('bxr-dialog')?.show(opener);
  const fitmentOpener = event.target.closest('[data-bxr-fitment-open]');
  const finder = document.querySelector('[data-bxr-fitment-dialog]')?.closest('bxr-dialog');
  if (fitmentOpener && finder) { event.preventDefault(); finder.show(fitmentOpener); }
  else if (fitmentOpener) {
    const inlineFinder = document.getElementById('bxr-fitment');
    if (!inlineFinder) return;
    event.preventDefault();
    inlineFinder.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    inlineFinder.querySelector('[data-field="year"]')?.focus({ preventScroll: true });
  }
});

class BxrFooter extends HTMLElement {
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.desktop = matchMedia('(min-width: 750px)');
    this.groups = [...this.querySelectorAll('.bxr-footer-group')];
    const sync = () => this.groups.forEach((group) => { group.open = this.desktop.matches; });
    this.desktop.addEventListener('change', sync, { signal: this.controller.signal });
    this.groups.forEach((group) => group.querySelector('summary').addEventListener('click', (event) => {
      if (this.desktop.matches) event.preventDefault();
    }, { signal: this.controller.signal }));
    sync();
  }
  disconnectedCallback() { this.controller?.abort(); }
}
if (!customElements.get('bxr-footer')) customElements.define('bxr-footer', BxrFooter);


class BxrProductTabs extends HTMLElement {
  static movement = new Map([['ArrowRight', 1], ['ArrowLeft', -1]]);
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.tabs = [...this.querySelectorAll('[data-product-tab]')];
    this.panels = [...this.querySelectorAll('[data-product-panel]')];
    this.querySelector('[data-product-tabs]').setAttribute('role', 'tablist');
    this.tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        this.select(index);
      }, { signal: this.controller.signal });
      tab.addEventListener('keydown', (event) => {
        const movement = BxrProductTabs.movement;
        if (!movement.has(event.key) && !['Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const target = event.key === 'Home' ? 0 : event.key === 'End' ? this.tabs.length - 1 : (index + movement.get(event.key) + this.tabs.length) % this.tabs.length;
        this.select(target);
        this.tabs[target].focus();
      }, { signal: this.controller.signal });
    });
    this.panels.forEach((panel) => { panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0; });
    this.select(0);
  }

  select(index) {
    this.tabs.forEach((tab, position) => {
      tab.setAttribute('aria-selected', String(position === index));
      tab.tabIndex = position === index ? 0 : -1;
    });
    this.panels.forEach((panel, position) => { panel.hidden = position !== index; });
  }

  disconnectedCallback() { this.controller?.abort(); }
}
if (!customElements.get('bxr-product-tabs')) customElements.define('bxr-product-tabs', BxrProductTabs);

class BxrMasthead extends HTMLElement {
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const refresh = () => {
      this.observer?.disconnect();
      const hero = document.querySelector('main bxr-carousel[data-immersive="true"]');
      this.toggleAttribute('data-overlay', false);
      if (!hero) return;
      this.observer = new IntersectionObserver(([entry]) => {
        this.toggleAttribute('data-overlay', entry.isIntersecting);
      }, { rootMargin: `-${this.offsetHeight}px 0px 0px 0px` });
      this.observer.observe(hero);
    };
    this.resizeObserver = new ResizeObserver(refresh);
    this.resizeObserver.observe(this);
    document.addEventListener('shopify:section:load', refresh, { signal: this.controller.signal });
    document.addEventListener('shopify:section:unload', refresh, { signal: this.controller.signal });
    refresh();
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
  }
}
if (!customElements.get('bxr-masthead')) customElements.define('bxr-masthead', BxrMasthead);
