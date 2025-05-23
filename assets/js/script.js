document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark-theme' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-theme');
        updateThemeToggleIcon('dark-theme');
    } else {
        body.classList.add('light-theme');
        updateThemeToggleIcon('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        const newTheme = body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
    });

    function updateThemeToggleIcon(currentTheme) {
        themeToggle.innerHTML = currentTheme === 'dark-theme' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', currentTheme === 'dark-theme' ? 'Switch to light theme' : 'Switch to dark theme');
    }

    // --- Hamburger Menu Toggle (New Animation Logic) ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // --- Skill Progress Bar Animation ---
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const animateSkills = () => {
        skillProgressBars.forEach(bar => bar.style.width = bar.dataset.level + '%');
    };

    if (window.location.pathname.includes('skills.html')) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) skillsObserver.observe(skillsSection); else animateSkills();
    }

    // --- iOS Style Modal for Form Submission ---
    const statusModal = document.getElementById('statusModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalClose = document.getElementById('modalClose');
    const contactForm = document.getElementById('contactForm');

    function showModal(title, message, isError = false) {
        if (!statusModal) return; // Guard clause
        modalTitle.textContent = title;
        modalMessage.innerHTML = message;
        statusModal.classList.add('show');
        modalTitle.style.color = isError ? '#dc3545' : 'var(--primary-color)';
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        if (!statusModal) return; // Guard clause
        statusModal.classList.remove('show');
        document.body.style.overflow = '';
        modalTitle.style.color = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
        statusModal.addEventListener('click', (e) => { if (e.target === statusModal) hideModal(); });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showModal("Sending...", "Please wait while your message is being processed.", false);
            const formData = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method, body: formData, headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    showModal("Message Sent!", "Thank you for reaching out! Your message has been sent successfully.", false);
                    contactForm.reset();
                } else {
                    showModal("Message Failed", "Thank you for reaching out! Unfortunately, there was a problem sending your message. <br><br>Please try sending an email directly to <a href='mailto:bingispandana21@gmail.com'>bingispandana21@gmail.com</a>.", true);
                }
            } catch (error) {
                showModal("Error", "An unexpected error occurred. <br><br>Please try sending an email directly to <a href='mailto:bingispandana21@gmail.com'>bingispandana21@gmail.com</a>.", true);
            }
        });
    }

    // --- Active Nav Link Highlight ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPath);
    });

    // --- Scroll Animations for elements ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index if needed, or use data-attributes
                // For simplicity, just add a class. CSS can handle staggered delays if items have delay classes.
                entry.target.classList.add('is-visible');
                // Optional: Add delay classes dynamically if elements are in a list
                // if (entry.target.parentElement.classList.contains('certificate-list') || entry.target.parentElement.classList.contains('about-content-wrapper')) {
                //     entry.target.style.transitionDelay = `${index * 0.1}s`;
                // }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 }); // Trigger when 15% of the element is visible

    scrollElements.forEach(el => elementObserver.observe(el));

});
