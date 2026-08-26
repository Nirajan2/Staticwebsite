/**
 * Nirajan - BIT Student Portfolio Website JS
 * Fully functional static website logic containing:
 * - Preloader
 * - Header Sticky & Nav Tracker
 * - Mobile Drawer Toggle
 * - Canvas Particles Animation
 * - Custom Typing Animation
 * - Scroll Reveal (Intersection Observer)
 * - Dynamic Skill Loader
 * - Form Submission simulation
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PRELOADER HANDLER
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600); // Syncs with CSS fade-out transition duration
        });
    }

    /* ==========================================================================
       2. STICKY NAVBAR & BACK-TO-TOP DISPLAY
       ========================================================================== */
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scroll-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // Sticky Navbar Transition
        if (scrollPosition > 20) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Show/Hide Back-to-Top Button
        if (scrollPosition > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        // Highlight Active Link on Scroll
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    /* ==========================================================================
       3. MOBILE HAMBURGER MENU DRAWER
       ========================================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navbar = document.getElementById('navbar');

    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close drawer menu when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       4. HERO CANVAS PARTICLE FLOW SYSTEM
       ========================================================================== */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let numberOfParticles = 50; // Performance optimized limit

        // Set dimensions
        function initCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        initCanvasSize();

        window.addEventListener('resize', () => {
            initCanvasSize();
            initParticles();
        });

        // Particle Class definition
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // Size radius
                this.speedX = Math.random() * 0.8 - 0.4; // Horizontal speed offset
                this.speedY = Math.random() * 0.8 - 0.4; // Vertical speed offset
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off canvas boundaries
                if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
            }

            draw() {
                ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`; // Primary cyan glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Initialize particles array
        function initParticles() {
            particlesArray = [];
            // Scale number of particles based on screen width
            numberOfParticles = window.innerWidth < 768 ? 25 : 60;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        initParticles();

        // Connect particles with thin network lines
        function connectParticles() {
            let maxDistance = window.innerWidth < 768 ? 90 : 135;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        // Opacity fades as distance increases
                        let opacityValue = 1 - (distance / maxDistance);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.12})`; // Secondary violet link
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==========================================================================
       5. HERO SECTION CUSTOM TYPING ANIMATION
       ========================================================================== */
    const dynamicTxt = document.getElementById('dynamic-txt');
    const roles = ["Frontend Developer", "React Developer", "Java & OOP Programmer", "Python Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Remove character
            dynamicTxt.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            // Write character
            dynamicTxt.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Natural typing speed
        }

        // Handle states transition
        if (!isDeleting && charIndex === currentRole.length) {
            // Complete typing, pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Complete deletion, proceed to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400; // Pause before starting next typing round
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start Typing loop if target element exists
    if (dynamicTxt) {
        setTimeout(typeEffect, 1000); // Delays startup until hero entrance completes
    }

    /* ==========================================================================
       6. INTERSECTION OBSERVER FOR SCROLL REVEAL & SKILLS PROGRESS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal-up, .scroll-reveal-fade, .timeline-item');
    const skillBars = document.querySelectorAll('.skill-progress-bar');

    // Reveal options
    const revealOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    // Generic reveal observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Stop observing after animating in
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Skills dynamic bar loader observer
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.getAttribute('data-percent');
                bar.style.width = percent;
                observer.unobserve(bar); // Animate once
            }
        });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });

    /* ==========================================================================
       7. SCROLL-TO-TOP FUNCTIONALITY
       ========================================================================== */
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       8. CONTACT FORM SIMULATION (FRONTEND RESPONSE)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const successCloseBtn = document.getElementById('btn-success-close');
    const submitBtn = document.getElementById('btn-submit');

    if (contactForm && successOverlay && successCloseBtn && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop standard page reload

            // Visual feedback on submit button loading state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `Sending... <i class="bx bx-loader-alt bx-spin"></i>`;
            submitBtn.style.pointerEvents = 'none';

            const formData = new FormData(contactForm);
            const payload = Object.fromEntries(formData.entries());
            payload.replyto = payload.email; // So hitting "Reply" in Gmail goes to the visitor, not Web3Forms
            payload.from_name = 'Portfolio Contact Form'; // Friendlier sender name than a generic default

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())
                .then(result => {
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.style.pointerEvents = 'auto';

                    if (result.success) {
                        // Show glassmorphic success overlay message box
                        successOverlay.classList.add('active');
                        contactForm.reset();
                    } else {
                        alert('Something went wrong sending your message. Please try again or email me directly.');
                    }
                })
                .catch(() => {
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.style.pointerEvents = 'auto';
                    alert('Network error — please check your connection and try again.');
                });
        });

        // Close Success Dialog
        successCloseBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
        });
    }
});