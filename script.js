/* ============================================
   SCRIPT.JS — Portfolio Interactivity
   Alemayehu Mekonen | Cyber Security Portfolio
   ============================================ */

// ─── 1. TYPING EFFECT ───────────────────────────────────────────
const roles = [
    'Cyber Security Analyst',
    'Penetration Tester',
    'Vulnerability Analyst',
    'Ethical Hacker',
    'Security Researcher'
];

let roleIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typing-role');

function typeRole() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIndex--);
    } else {
        typingEl.textContent = currentRole.substring(0, charIndex++);
    }

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex > currentRole.length) {
        delay = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
        delay = 400;
    }
    setTimeout(typeRole, delay);
}

// ─── 2. PARTICLE CANVAS ─────────────────────────────────────────
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const count = Math.floor(window.innerWidth / 10);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.1
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw dots
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(drawParticles);
    }

    drawParticles();

    window.addEventListener('resize', () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ─── 3. SCROLL REVEAL ────────────────────────────────────────────
function initReveal() {
    // Add reveal class to all major blocks
    const targets = document.querySelectorAll(
        '.card, .section-header, .hero-inner, .scroll-indicator'
    );
    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── 4. SKILL BARS ──────────────────────────────────────────────
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.dataset.width + '%';
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    bars.forEach(b => observer.observe(b));
}

// ─── 5. ACTIVE NAV ON SCROLL ────────────────────────────────────
function initActiveNav() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(s => observer.observe(s));
}

// ─── 6. MOBILE MENU ─────────────────────────────────────────────
function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu   = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => menu.classList.remove('open'));
    });
}

// ─── 7. CONTACT FORM ────────────────────────────────────────────
function initContactForm() {
    const form = document.getElementById('contact-form');
    const btn  = document.getElementById('submit-btn');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        btn.innerHTML = '<span>Transmission Sent ✓</span>';
        btn.style.background = 'linear-gradient(135deg, #00ff41, #00a832)';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = '<span>Transmit Message</span><span class="btn-arrow">→</span>';
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 3500);
    });
}

// ─── 8. GLITCH / DECRYPT HOVER ───────────────────────────────────
function initDecryptHover() {
    const chars = '!@#$%^&*<>?/\\|{}[]0123456789ABCDEF';
    document.querySelectorAll('.hero-name').forEach(el => {
        const original = el.innerText;
        el.addEventListener('mouseenter', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                el.querySelectorAll('*').forEach(child => {
                    child.innerText = child.innerText
                        .split('')
                        .map((char, i) => {
                            if (char === '\n' || i < iterations) return char;
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');
                });
                iterations += 1;
                if (iterations > 12) clearInterval(interval);
            }, 50);
        });
    });
}

// ─── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    typeRole();
    initParticles();
    initReveal();
    initSkillBars();
    initActiveNav();
    initMobileMenu();
    initContactForm();
    initDecryptHover();
});
