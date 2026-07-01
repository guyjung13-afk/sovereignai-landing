/* ═══════════════════════════════════════════════════════════════
   SOVEREIGNAI V4.0 — THE FINAL SYNTHESIS
   Minimal, performant interactions
   ═══════════════════════════════════════════════════════════════ */
(function() {
    'use strict';

    // NAV TOGGLE
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', function() {
            var open = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open);
        });
        links.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', function() {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // SCROLL REVEAL
    var revealElements = document.querySelectorAll(
        '.section-block, .arch-card, .flow-step, .vertical-card, .deploy-card, ' +
        '.hardware-item, .manifesto-card, .inquiry-form, .hardware-section'
    );

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function(el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s ease ' + (i % 4) * 0.1 + 's, transform 0.7s ease ' + (i % 4) * 0.1 + 's';
        observer.observe(el);
    });

    // FORM HANDLING - TIER 2
    var form = document.getElementById('inquiry-form');
    var submitBtn = document.getElementById('submit-btn');
    var btnText = submitBtn.querySelector('.btn-text');
    var btnSpinner = submitBtn.querySelector('.btn-spinner');
    var formMessage = document.getElementById('form-message');

    // NAV BACKGROUND ON SCROLL (refined)
    var nav = document.querySelector('nav');
    var scrolled = false;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 60 && !scrolled) {
            nav.style.borderBottomColor = 'rgba(212, 175, 55, 0.15)';
            scrolled = true;
        } else if (window.scrollY <= 60 && scrolled) {
            nav.style.borderBottomColor = '';
            scrolled = false;
        }
    }, { passive: true });

})();

// REVEAL CLASS
document.head.insertAdjacentHTML('beforeend',
    '<style>.revealed{opacity:1!important;transform:translateY(0)!important;}</style>'
);