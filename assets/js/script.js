document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set theme: Dark by default if no preference, or if prefersDark, or if savedTheme is dark.
    // Otherwise, default to light.
    if (savedTheme === 'dark-theme' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-theme');
        updateThemeToggleIcon('dark-theme');
    } else {
        body.classList.add('light-theme'); // Default to light if no saved preference or prefers light
        updateThemeToggleIcon('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
            updateThemeToggleIcon('light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateThemeToggleIcon('dark-theme');
        }
    });

    function updateThemeToggleIcon(currentTheme) {
        if (currentTheme === 'dark-theme') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }

    // --- Hamburger Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent scrolling when mobile menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close hamburger menu when a nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // --- Skill Progress Bar Animation (for skills.html) ---
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    const animateSkills = () => {
        skillProgressBars.forEach(bar => {
            const level = bar.dataset.level;
            bar.style.width = level + '%'; // Animate width based on data-level
        });
    };

    // Trigger skill animation only on the skills page
    if (window.location.pathname.includes('skills.html')) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.disconnect(); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of the element is visible
        });

        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            observer.observe(skillsSection);
        } else {
            // Fallback for immediate animation if observer isn't suitable (e.g., section already in view on load)
            animateSkills();
        }
    }

    // --- iOS Style Modal for Form Submission Status (for about.html) ---
    const statusModal = document.getElementById('statusModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalClose = document.getElementById('modalClose');
    const contactForm = document.getElementById('contactForm');

    function showModal(title, message, isError = false) {
        modalTitle.textContent = title;
        modalMessage.innerHTML = message; // Use innerHTML for potential links
        statusModal.classList.add('show');
        if (isError) {
            modalTitle.style.color = '#dc3545'; // Error red
        } else {
            modalTitle.style.color = 'var(--primary-color)'; // Primary blue for success
        }
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function hideModal() {
        statusModal.classList.remove('show');
        document.body.style.overflow = ''; // Re-enable scrolling
        modalTitle.style.color = ''; // Reset color
    }

    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
        statusModal.addEventListener('click', (e) => {
            if (e.target === statusModal) { // Close if clicked outside content
                hideModal();
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Optional: Show a "Sending..." message before fetch
            showModal("Sending Message...", "Please wait while your message is being sent.", false); // Not an error, just sending

            const formData = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showModal("Message Sent!", "Thank you for your message, Spandana! I have received your inquiry and will get back to you shortly.", false);
                    contactForm.reset(); // Clear the form
                } else {
                    let errorMessage = "Unfortunately, there was a problem sending your message via the form.";
                    errorMessage += "<br><br>Please consider sending an email directly to <a href='mailto:bingispandana21@gmail.com'>bingispandana21@gmail.com</a>. We apologize for the inconvenience.";
                    showModal("Message Failed to Send", errorMessage, true);
                }
            } catch (error) {
                let errorMessage = "An error occurred: " + error.message + ".";
                errorMessage += "<br><br>Please consider sending an email directly to <a href='mailto:bingispandana21@gmail.com'>bingispandana21@gmail.com</a>. We apologize for the inconvenience.";
                showModal("Message Failed to Send", errorMessage, true);
            }
        });
    }

    // --- Active Nav Link Highlight ---
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

});
