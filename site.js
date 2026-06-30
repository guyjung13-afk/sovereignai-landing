// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Nav scroll effect
const nav = document.querySelector('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(5, 7, 10, 0.95)';
            nav.style.borderBottomColor = 'rgba(212, 175, 55, 0.1)';
        } else {
            nav.style.background = 'rgba(5, 7, 10, 0.85)';
            nav.style.borderBottomColor = 'rgba(142, 154, 175, 0.08)';
        }
    });
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Scan pulse effect
const scanContainer = document.querySelector('.sovereign-scan');
if (scanContainer) {
    setInterval(() => {
        const pulse = document.createElement('div');
        pulse.className = 'scan-line';
        scanContainer.appendChild(pulse);
        setTimeout(() => pulse.remove(), 12000);
    }, 18000);
}