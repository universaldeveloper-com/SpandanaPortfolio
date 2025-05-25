document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle --- (Keep existing logic)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    // ... (rest of theme toggle logic) ...
    if (themeToggle) { // Ensure themeToggle exists
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
    }
    function updateThemeToggleIcon(currentTheme) {
        if (!themeToggle) return;
        themeToggle.innerHTML = currentTheme === 'dark-theme' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', currentTheme === 'dark-theme' ? 'Switch to light theme' : 'Switch to dark theme');
    }


    // --- Hamburger Menu Toggle --- (Keep existing logic)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
     if (hamburger && navMenu) { // Ensure elements exist
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
    }


    // --- Skill Progress Bar Animation (adapted for new structure if needed) ---
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const animateSkills = () => {
        skillProgressBars.forEach(bar => {
            const level = bar.closest('.skill-item')?.querySelector('.skill-level-text')?.textContent.replace('%','') || bar.dataset.level || '0';
            bar.style.width = level + '%';
        });
    };

    if (window.location.pathname.includes('skills.html') && skillProgressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills(); // This will animate all bars once the section is visible
                    // To animate individual bars as they appear:
                    // const barsToAnimate = entry.target.querySelectorAll('.skill-progress');
                    // barsToAnimate.forEach(bar => {
                    //     const level = bar.closest('.skill-item').querySelector('.skill-level-text').textContent.replace('%','');
                    //     bar.style.width = level + '%';
                    // });
                    observer.unobserve(entry.target); // Observe section once
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% of the section is visible
        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) skillsObserver.observe(skillsSection);
        else animateSkills(); // Fallback
    }


    // --- iOS Style Modal for Form Submission --- (Keep existing logic)
    const statusModal = document.getElementById('statusModal');
    // ... (rest of contact form modal logic) ...
    if (statusModal) { // Ensure elements exist
        const modalTitleEl = document.getElementById('modalTitle');
        const modalMessageEl = document.getElementById('modalMessage');
        const modalCloseBtn = document.getElementById('modalClose');
        const contactFormEl = document.getElementById('contactForm');

        function showContactModal(title, message, isError = false) {
            if (!modalTitleEl || !modalMessageEl) return;
            modalTitleEl.textContent = title;
            modalMessageEl.innerHTML = message;
            statusModal.classList.add('show');
            modalTitleEl.style.color = isError ? '#dc3545' : 'var(--primary-color)';
            document.body.style.overflow = 'hidden';
        }
        function hideContactModal() {
            statusModal.classList.remove('show');
            document.body.style.overflow = '';
            if(modalTitleEl) modalTitleEl.style.color = '';
        }
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideContactModal);
        statusModal.addEventListener('click', (e) => { if (e.target === statusModal) hideContactModal(); });

        if (contactFormEl) {
            contactFormEl.addEventListener('submit', async (e) => {
                e.preventDefault();
                showContactModal("Sending...", "Please wait...", false);
                // ... rest of fetch logic ...
                 try {
                    const response = await fetch(contactFormEl.action, {
                        method: contactFormEl.method, body: new FormData(contactFormEl), headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        showContactModal("Message Sent!", "Thank you for reaching out!", false);
                        contactFormEl.reset();
                    } else {
                         showContactModal("Message Failed", "Thank you for reaching out! Unfortunately, there was a problem sending your message. <br><br>Please try sending an email directly to <a href='mailto:bingispandana21@gmail.com'>bingispandana21@gmail.com</a>.", true);
                    }
                } catch (error) {
                    showContactModal("Error", "An unexpected error occurred. <br><br>Please try sending an email directly to <a href='mailto:bingispandana21@gmail.com'>bingispandana21@gmail.com</a>.", true);
                }
            });
        }
    }


    // --- Certificate Viewer Modal ---
    const certificateModal = document.getElementById('certificateModal');
    const certificateModalImage = document.getElementById('certificateModalImage');
    const certificateModalTitle = document.getElementById('certificateModalTitle');
    const certificateModalClose = certificateModal?.querySelector('.certificate-modal-close');
    const certificateItems = document.querySelectorAll('.certificate-item');

    if (certificateModal && certificateModalImage && certificateModalTitle && certificateModalClose) {
        certificateItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.dataset.certificateImg;
                const imgTitle = item.dataset.certificateTitle || "Certificate"; // Fallback title
                if (imgSrc) {
                    certificateModalImage.src = imgSrc;
                    certificateModalTitle.textContent = imgTitle;
                    certificateModal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        const closeCertModal = () => {
            certificateModal.classList.remove('show');
            document.body.style.overflow = ''; // Re-enable scrolling
        };

        certificateModalClose.addEventListener('click', closeCertModal);
        certificateModal.addEventListener('click', (e) => {
            if (e.target === certificateModal) { // Click on overlay
                closeCertModal();
            }
        });
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && certificateModal.classList.contains('show')) {
                closeCertModal();
            }
        });
    }


    // --- Active Nav Link Highlight --- (Keep existing logic)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
         if(link) link.classList.toggle('active', link.getAttribute('href') === currentPath);
    });

    // --- Scroll Animations for elements --- (Keep existing logic)
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
     if (scrollElements.length > 0) { // Ensure elements exist
        const elementObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // Adjust threshold as needed

        scrollElements.forEach(el => elementObserver.observe(el));
    }
});
