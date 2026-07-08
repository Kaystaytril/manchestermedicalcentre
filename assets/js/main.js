/* ==========================================================================
   Manchester Medical Centre — shared site script
   --------------------------------------------------------------------------
   ▼▼▼  EDIT YOUR DETAILS HERE  ▼▼▼
   Replace the placeholder values below with the clinic's real ones.
   (See CONTENT.md for the full checklist.)
   ========================================================================== */
const SITE = {
  // Phone shown in header/footer, used by the "Call" buttons. Digits + country code.
  phoneDisplay: '033 000 0000',          // REPLACE — how the number reads on screen
  phoneDial:    '+2733XXXXXXX',           // REPLACE — tel: link target

  // WhatsApp click-to-chat number in full international format, NO "+" or spaces.
  whatsapp:     '2733XXXXXXX',            // REPLACE  e.g. 27821234567

  email:        'info@manchestermedical.co.za',  // REPLACE

  // Cal.com booking links, one per practice — format "username/event-slug".
  // Paste the real links from your Cal.com account. Until then the page shows
  // a phone/WhatsApp fallback if the embed can't load.
  calLinks: {
    optometry:     'manchester-medical/eye-test',   // REPLACE — New Sight Optometry
    dentistry:     'manchester-medical/dental',      // REPLACE — The Smile Clinic Dentistry
    physiotherapy: 'manchester-medical/physio',      // REPLACE — Ms N Paruk Physiotherapy
  },

  // Optional: paste a Formspree form ID (e.g. "xdorwkgv") to make the contact
  // form email you. Leave blank to fall back to the visitor's email app.
  formspreeId: '',
};
/* ▲▲▲  END OF EDITABLE DETAILS  ▲▲▲ */


(function () {
  'use strict';

  /* ---- Mark that JS is active so reveal animations engage (progressive
         enhancement — without this class all content stays fully visible) ---- */
  document.documentElement.classList.add('js');

  /* ---- Wire phone / whatsapp / email links marked with data-site ---- */
  document.querySelectorAll('[data-site="phone"]').forEach(el => {
    el.setAttribute('href', 'tel:' + SITE.phoneDial);
    if (el.dataset.fill !== 'no') el.textContent = SITE.phoneDisplay;
  });
  document.querySelectorAll('[data-site="phone-text"]').forEach(el => { el.textContent = SITE.phoneDisplay; });
  document.querySelectorAll('[data-site="whatsapp"]').forEach(el => {
    const msg = encodeURIComponent(el.dataset.msg || "Hello Manchester Medical Centre, I'd like to book an appointment.");
    el.setAttribute('href', `https://wa.me/${SITE.whatsapp}?text=${msg}`);
    el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('[data-site="email"]').forEach(el => {
    el.setAttribute('href', 'mailto:' + SITE.email);
    if (el.dataset.fill !== 'no') el.textContent = SITE.email;
  });

  /* ---- Header shadow on scroll ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const menu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('backdrop');
  const openMenu = () => { menu && menu.classList.add('open'); backdrop && backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { menu && menu.classList.remove('open'); backdrop && backdrop.classList.remove('open'); document.body.style.overflow = ''; };
  document.getElementById('navToggle')?.addEventListener('click', openMenu);
  document.getElementById('menuClose')?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---- Desktop dropdown: click-to-toggle for touch + keyboard ---- */
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(trigger => {
    trigger.addEventListener('click', e => {
      const parent = trigger.parentElement;
      if (trigger.getAttribute('href') === '#') e.preventDefault();
      const isOpen = parent.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach(p => p.classList.remove('open'));
      parent.classList.toggle('open', !isOpen);
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.has-dropdown')) document.querySelectorAll('.has-dropdown.open').forEach(p => p.classList.remove('open'));
  });

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---- Contact / enquiry form ---- */
  const form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const success = document.getElementById('formSuccess');
      const showOk = () => { form.reset(); if (success) { success.classList.add('show'); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); } };

      if (SITE.formspreeId) {
        try {
          const r = await fetch('https://formspree.io/f/' + SITE.formspreeId, {
            method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form),
          });
          if (r.ok) return showOk();
        } catch (_) { /* fall through to mailto */ }
      }
      // Fallback: open the visitor's email client with a pre-filled message.
      const body = `Name: ${data.name || ''}%0D%0APhone: ${data.phone || ''}%0D%0AEmail: ${data.email || ''}%0D%0AInterest: ${data.service || ''}%0D%0A%0D%0A${(data.message || '').replace(/\n/g, '%0D%0A')}`;
      window.location.href = `mailto:${SITE.email}?subject=Website enquiry from ${encodeURIComponent(data.name || 'patient')}&body=${body}`;
      showOk();
    });
  }

  /* ---- Booking page: Cal.com discipline selector ---- */
  const calInline = document.getElementById('cal-inline');
  if (calInline) {
    const tabs = document.querySelectorAll('.booking-tab');
    const fallback = document.getElementById('calFallback');
    let calReady = false;

    // Official Cal.com embed loader (adds window.Cal).
    (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

    try {
      window.Cal("init", { origin: "https://cal.com" });
      calReady = true;
    } catch (err) { calReady = false; }

    const render = (discipline) => {
      const link = SITE.calLinks[discipline];
      if (!calReady || !link || link.includes('manchester-medical/')) {
        // No real link configured yet (or embed blocked) → show fallback.
        if (fallback) fallback.style.display = 'block';
        calInline.style.display = 'none';
        return;
      }
      if (fallback) fallback.style.display = 'none';
      calInline.style.display = 'block';
      calInline.innerHTML = '';
      window.Cal("inline", {
        elementOrSelector: "#cal-inline",
        calLink: link,
        config: { theme: "light" },
      });
    };

    const select = (discipline) => {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.discipline === discipline));
      render(discipline);
    };
    tabs.forEach(t => t.addEventListener('click', () => select(t.dataset.discipline)));

    // Preselect via ?d=dental / eye / physio, else first tab.
    const params = new URLSearchParams(location.search);
    const map = { eye: 'optometry', optometry: 'optometry', dental: 'dentistry', dentistry: 'dentistry', physio: 'physiotherapy', physiotherapy: 'physiotherapy' };
    select(map[params.get('d')] || 'optometry');
  }

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
