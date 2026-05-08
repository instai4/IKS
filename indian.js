/* ═══════════════════════════════════════════════════════════════
   PARTICLES SYSTEM
═══════════════════════════════════════════════════════════════ */

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let W, H;
let particles = [];

/* ───────── Resize Canvas ───────── */

function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

/* ───────── Particle Class ───────── */

class Particle {

    constructor() {
        this.reset();
    }

    reset() {

        this.x = Math.random() * W;
        this.y = Math.random() * H;

        this.r = Math.random() * 1.6 + 0.3;

        this.vx = (Math.random() - 0.5) * 0.22;
        this.vy = -Math.random() * 0.38 - 0.1;

        this.life = Math.random();
        this.maxLife = Math.random() * 0.5 + 0.3;

        this.color =
            Math.random() > 0.6
                ? '#C9952A'
                : '#E8752A';
    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        this.life -= 0.002;

        if (this.life <= 0 || this.y < -10) {
            this.reset();
        }
    }

    draw() {

        ctx.save();

        ctx.globalAlpha = Math.max(0, this.life) * 0.75;

        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/* ───────── Initialize Particles ───────── */

function initParticles() {

    particles = Array.from({ length: 180 }, () => {

        const p = new Particle();

        p.life = Math.random() * p.maxLife;

        return p;
    });
}

initParticles();

/* ───────── Animate Particles ───────── */

function animateParticles() {

    ctx.clearRect(0, 0, W, H);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();


/* ═══════════════════════════════════════════════════════════════
   LANGUAGE TOGGLE
═══════════════════════════════════════════════════════════════ */

let currentLang = 'en';

function toggleLang() {

    currentLang =
        currentLang === 'en'
            ? 'hi'
            : 'en';

    const label = document.getElementById('lang-label');

    label.textContent =
        currentLang === 'en'
            ? 'हिन्दी'
            : 'English';

    document.querySelectorAll('[data-en]').forEach(el => {

        el.textContent =
            currentLang === 'hi'
                ? el.getAttribute('data-hi')
                : el.getAttribute('data-en');
    });
}


/* ═══════════════════════════════════════════════════════════════
   SECTION OBSERVER
═══════════════════════════════════════════════════════════════ */

const sections = document.querySelectorAll(
    '.era-section, .quote-section, .timeline-strip'
);

const navDots = document.querySelectorAll('.nav-dot');

const sectionEls = [
    document.getElementById('hero'),
    document.getElementById('s1'),
    document.getElementById('s2'),
    document.getElementById('s3'),
    document.getElementById('s4'),
    document.getElementById('s5'),
    document.getElementById('s6'),
    document.getElementById('s7'),
    document.getElementById('s8'),
    document.getElementById('s9'),
    document.getElementById('s10'),
    document.getElementById('s11'),
    document.getElementById('s12'),
    document.getElementById('s13'),
    document.getElementById('s14'),
    document.getElementById('s15'),
    document.getElementById('s16'),
    document.getElementById('s17'),
    document.getElementById('s18'),
];

/* ───────── Intersection Observer ───────── */

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    },

    {
        threshold: 0.12
    }
);

sections.forEach(section => {
    observer.observe(section);
});


/* ───────── Scroll Progress + Active Nav ───────── */

window.addEventListener('scroll', () => {

    const pct =
        window.scrollY /
        (document.body.scrollHeight - window.innerHeight);

    document.getElementById('progress-bar').style.width =
        (pct * 100) + '%';

    sectionEls.forEach((el, i) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const inView =
            rect.top <= window.innerHeight * 0.55 &&
            rect.bottom >= window.innerHeight * 0.45;

        if (inView) {
            navDots.forEach(dot => {
                dot.classList.remove('active');
            });

            if (navDots[i]) {
                navDots[i].classList.add('active');
            }

            // Update Dynamic Accent Color
            updateAccentColor(el);
        }
    });
});

/**
 * Updates the global --accent-color based on the active section's theme class
 */
function updateAccentColor(section) {
    const root = document.documentElement;
    const classes = section.className;
    
    let color = 'var(--gold)'; // Default

    if (classes.includes('glow-teal')) color = 'var(--accent-teal)';
    else if (classes.includes('glow-saffron')) color = 'var(--accent-saffron)';
    else if (classes.includes('glow-crimson')) color = 'var(--accent-crimson)';
    else if (classes.includes('glow-blue')) color = 'var(--accent-blue)';
    else if (classes.includes('glow-green')) color = 'var(--accent-green)';
    else if (classes.includes('glow-purple')) color = 'var(--accent-purple)';
    else if (classes.includes('glow-rose')) color = 'var(--accent-rose)';
    else if (classes.includes('glow-amber')) color = 'var(--accent-amber)';
    else if (classes.includes('glow-indigo')) color = 'var(--accent-indigo)';
    else if (classes.includes('glow-gold')) color = 'var(--accent-gold)';

    root.style.setProperty('--accent-color', color);
}


/* ───────── Nav Dot Click Scroll ───────── */

navDots.forEach((dot, i) => {

    dot.addEventListener('click', () => {

        if (sectionEls[i]) {

            sectionEls[i].scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


/* ═══════════════════════════════════════════════════════════════
   ORBITAL SVG ANIMATION
═══════════════════════════════════════════════════════════════ */

let t = 0;

setInterval(() => {

    t += 0.012;

    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    const p3 = document.getElementById('p3');
    const p4 = document.getElementById('p4');

    if (p1) {

        p1.setAttribute(
            'cx',
            200 + 45 * Math.cos(t * 2.5)
        );

        p1.setAttribute(
            'cy',
            200 + 45 * Math.sin(t * 2.5)
        );
    }

    if (p2) {

        p2.setAttribute(
            'cx',
            200 + 55 * Math.cos(-t * 1.5 + 1)
        );

        p2.setAttribute(
            'cy',
            200 + 55 * Math.sin(-t * 1.5 + 1)
        );
    }

    if (p3) {

        p3.setAttribute(
            'cx',
            200 + 80 * Math.cos(t * 0.8 + 2)
        );

        p3.setAttribute(
            'cy',
            200 + 80 * Math.sin(t * 0.8 + 2)
        );
    }

    if (p4) {

        p4.setAttribute(
            'cx',
            200 + 108 * Math.cos(-t * 0.5 + 3)
        );

        p4.setAttribute(
            'cy',
            200 + 108 * Math.sin(-t * 0.5 + 3)
        );
    }

}, 30);



/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR LOGIC
 ═══════════════════════════════════════════════════════════════ */

const cursor = document.querySelector('.custom-cursor');
const cursorGlow = document.querySelector('.custom-cursor-glow');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let glowX = 0;
let glowY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth interpolation (lerp)
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }
    if (cursorGlow) {
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
    }

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Magnetic & Hover Effects
const interactiveEls = document.querySelectorAll('button, .nav-dot, .social-icon, a, .t-event');

interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorGlow.classList.add('hover');
    });

    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorGlow.classList.remove('hover');
        el.style.transform = ''; // Reset magnetic pull
    });

    el.addEventListener('mousemove', (e) => {
        // Subtle magnetic pull effect
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pullX = (e.clientX - centerX) * 0.3;
        const pullY = (e.clientY - centerY) * 0.3;

        el.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
    });
});

/* ═══════════════════════════════════════════════════════════════
   INTRO OVERLAY (Updated)
 ═══════════════════════════════════════════════════════════════ */

window.addEventListener('load', () => {
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        document.body.style.overflow = '';
        const intro = document.getElementById('intro-overlay');
        
        if (intro) {
            intro.style.opacity = '0';
            intro.style.pointerEvents = 'none';
            intro.style.transition = 'opacity 1.5s ease-out';
            
            setTimeout(() => {
                intro.remove();
            }, 1500);
        }
    }, 4200);
});