/* ================================================
   ATTOCK PROPERTY — Main JavaScript
   Nav | Search | Tabs | Filters | WhatsApp | Toast
   ================================================ */

'use strict';

// ─── Helpers ─────────────────────────────────
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const on = (el, ev, fn) => el?.addEventListener(ev, fn);

// ─── Your WhatsApp Number ─────────────────────
// TODO: Apna number yahan likhein: 923xxxxxxxxx
const WA_NUMBER = '923000000000';

function waLink(msg) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ─── Navigation ──────────────────────────────
function initNav() {
  const nav = $('#main-nav');
  const menuBtn = $('#menu-btn');
  const mobileMenu = $('#mobile-menu');

  // Scroll effect
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  on(menuBtn, 'click', () => {
    const open = menuBtn.classList.toggle('open');
    mobileMenu?.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  $$('.mobile-menu .nav-link').forEach(link => {
    on(link, 'click', () => {
      menuBtn?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── Search Tabs ──────────────────────────────
function initSearchTabs() {
  const tabs = $$('.search-tab');
  tabs.forEach(tab => {
    on(tab, 'click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Update type hidden input if exists
      const typeInput = $('#search-type');
      if (typeInput) typeInput.value = tab.dataset.type;
    });
  });
}

// ─── Search Form ──────────────────────────────
function initSearch() {
  const form = $('#search-form');
  on(form, 'submit', (e) => {
    e.preventDefault();
    const type = $('.search-tab.active')?.dataset.type || 'buy';
    const area = $('#search-area')?.value || '';
    const propType = $('#search-proptype')?.value || '';
    const price = $('#search-price')?.value || '';

    // Build URL params
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (area) params.set('area', area);
    if (propType) params.set('proptype', propType);
    if (price) params.set('price', price);

    window.location.href = `pages/properties.html?${params.toString()}`;
  });
}

// ─── WhatsApp Triggers ────────────────────────
function initWhatsAppButtons() {
  // Property inquiry
  $$('[data-wa="property"]').forEach(btn => {
    on(btn, 'click', () => {
      const title = btn.dataset.title || 'Property';
      const msg = `Assalam o Alaikum! Mujhe "${title}" ke baare mein information chahiye. Kya yeh available hai?`;
      window.open(waLink(msg), '_blank');
    });
  });

  // Listing submit
  $$('[data-wa="listing"]').forEach(btn => {
    on(btn, 'click', () => {
      const msg = `Assalam o Alaikum! Main apni property list karwana chahta hoon Attock Property pe. Kripya mujhe guide karein.`;
      window.open(waLink(msg), '_blank');
    });
  });

  // Patwari service
  $$('[data-wa="patwari"]').forEach(btn => {
    on(btn, 'click', () => {
      const service = btn.dataset.service || 'Legal Service';
      const msg = `Assalam o Alaikum! Mujhe "${service}" ki zaroorat hai. Kripya details batayein.`;
      window.open(waLink(msg), '_blank');
    });
  });

  // Guide purchase
  $$('[data-wa="guide"]').forEach(btn => {
    on(btn, 'click', () => {
      const guide = btn.dataset.guide || 'Guide';
      const price = btn.dataset.price || '';
      const msg = `Assalam o Alaikum! Main "${guide}" khareedna chahta hoon${price ? ` (Rs. ${price})` : ''}. Payment kaise karni hai?`;
      window.open(waLink(msg), '_blank');
    });
  });

  // Agent inquiry
  $$('[data-wa="agent"]').forEach(btn => {
    on(btn, 'click', () => {
      const name = btn.dataset.name || 'Agent';
      const msg = `Assalam o Alaikum! Main ${name} se baat karna chahta hoon property ke baare mein.`;
      window.open(waLink(msg), '_blank');
    });
  });

  // General contact
  $$('[data-wa="contact"]').forEach(btn => {
    on(btn, 'click', () => {
      const msg = `Assalam o Alaikum! Main Attock Property se rabta karna chahta hoon.`;
      window.open(waLink(msg), '_blank');
    });
  });

  // Float button
  const floatBtn = $('#wa-float');
  on(floatBtn, 'click', () => {
    const msg = `Assalam o Alaikum! Main Attock Property website se contact kar raha hoon. Mujhe madad chahiye.`;
    window.open(waLink(msg), '_blank');
  });
}

// ─── Property Filters (properties page) ──────
function initPropertyFilters() {
  const filterBtns = $$('.filter-pill');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    on(btn, 'click', () => {
      const group = btn.dataset.group;
      $$(`[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  // Price range
  const priceRange = $('#price-range');
  const priceDisplay = $('#price-display');
  on(priceRange, 'input', () => {
    if (priceDisplay) {
      const val = parseInt(priceRange.value);
      priceDisplay.textContent = val >= 10000000
        ? `Rs. ${(val/10000000).toFixed(1)} Crore`
        : `Rs. ${(val/100000).toFixed(0)} Lakh`;
    }
    applyFilters();
  });
}

function applyFilters() {
  const cards = $$('.property-card[data-type]');
  if (!cards.length) return;

  const activeType = $('.filter-pill.active[data-group="type"]')?.dataset.value || 'all';
  const activeArea = $('.filter-pill.active[data-group="area"]')?.dataset.value || 'all';
  const activeKind = $('.filter-pill.active[data-group="kind"]')?.dataset.value || 'all';

  let visible = 0;
  cards.forEach(card => {
    const matchType = activeType === 'all' || card.dataset.type === activeType;
    const matchArea = activeArea === 'all' || card.dataset.area === activeArea;
    const matchKind = activeKind === 'all' || card.dataset.kind === activeKind;
    const show = matchType && matchArea && matchKind;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  const count = $('#results-count');
  if (count) count.textContent = `${visible} properties mile`;
}

// ─── Scroll Reveal ────────────────────────────
function initReveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

// ─── Counter Animation ────────────────────────
function initCounters() {
  const counters = $$('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

// ─── Toast ────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = $('#toast-container');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

// ─── Copy Phone ───────────────────────────────
function initCopyPhone() {
  $$('[data-copy-phone]').forEach(btn => {
    on(btn, 'click', () => {
      const num = btn.dataset.copyPhone;
      navigator.clipboard.writeText(num).then(() => {
        showToast('Number copy ho gaya! 📋');
      }).catch(() => {
        showToast(num, 'info');
      });
    });
  });
}

// ─── Save Property (local) ────────────────────
function initSaveProperty() {
  $$('.property-save').forEach(btn => {
    const id = btn.dataset.id;
    const saved = JSON.parse(localStorage.getItem('saved_props') || '[]');
    if (saved.includes(id)) btn.textContent = '❤️';

    on(btn, 'click', () => {
      const list = JSON.parse(localStorage.getItem('saved_props') || '[]');
      const idx = list.indexOf(id);
      if (idx === -1) {
        list.push(id);
        btn.textContent = '❤️';
        showToast('Property save ho gayi!');
      } else {
        list.splice(idx, 1);
        btn.textContent = '🤍';
        showToast('Property unsave ho gayi.');
      }
      localStorage.setItem('saved_props', JSON.stringify(list));
    });
  });
}

// ─── Guide Preview Toggle ─────────────────────
function initGuidePreview() {
  $$('[data-guide-id]').forEach(btn => {
    on(btn, 'click', () => {
      const id = btn.dataset.guideId;
      const preview = $(`#guide-preview-${id}`);
      if (preview) {
        const open = preview.classList.toggle('hidden');
        btn.textContent = open ? 'Preview Dekhein ▼' : 'Preview Band Karein ▲';
      }
    });
  });
}

// ─── URL Params → Auto Filter ────────────────
function applyUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const area = params.get('area');

  if (type) {
    const btn = $(`.filter-pill[data-group="type"][data-value="${type}"]`);
    if (btn) {
      $$('[data-group="type"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }
  if (area) {
    const areaSelect = $('#search-area');
    if (areaSelect) areaSelect.value = area;
  }

  applyFilters();
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSearchTabs();
  initSearch();
  initWhatsAppButtons();
  initPropertyFilters();
  initReveal();
  initCounters();
  initCopyPhone();
  initSaveProperty();
  initGuidePreview();

  // URL params on properties page
  if (window.location.pathname.includes('properties')) {
    applyUrlFilters();
  }
});
