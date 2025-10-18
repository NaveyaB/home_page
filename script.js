document.addEventListener('DOMContentLoaded', () => {
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });

        // Close nav when a link is clicked (for mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach((item) => item.style.animation = ''); // Reset animation
            });
        });
    };

    const setupSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Calculate offset for fixed header
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 20; // -20 for a little extra padding

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    const setupProjectSlider = () => {
        const slider = document.querySelector('.project-slider');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const projectCards = document.querySelectorAll('.project-card');

        let currentIndex = 0;
        const cardWidth = projectCards[0].offsetWidth + (parseFloat(getComputedStyle(projectCards[0]).marginLeft) * 2); // Card width + margin on both sides

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }

        nextBtn.addEventListener('click', () => {
            if (currentIndex < projectCards.length - 1) { // Can adjust based on how many cards you want visible
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = projectCards.length - 1; // Loop to end
            }
            updateSlider();
        });

        // Optional: Add touch/drag support for mobile
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;

        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos = e.clientX;
            animationID = requestAnimationFrame(animation);
            slider.style.cursor = 'grabbing';
        });

        slider.addEventListener('mouseup', () => {
            isDragging = false;
            cancelAnimationFrame(animationID);
            slider.style.cursor = 'grab';

            // Snap to nearest card
            const movedBy = currentTranslate - prevTranslate;
            if (movedBy < -cardWidth / 4) { // Swiped left significantly
                currentIndex = Math.min(projectCards.length - 1, currentIndex + 1);
            } else if (movedBy > cardWidth / 4) { // Swiped right significantly
                currentIndex = Math.max(0, currentIndex - 1);
            }
            prevTranslate = currentIndex * -cardWidth;
            updateSlider();
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentTranslate = prevTranslate + e.clientX - startPos;
            slider.style.transform = `translateX(${currentTranslate}px)`;
        });

        slider.addEventListener('mouseleave', () => { // If mouse leaves while dragging
            if (isDragging) {
                isDragging = false;
                cancelAnimationFrame(animationID);
                slider.style.cursor = 'grab';
                prevTranslate = currentIndex * -cardWidth; // Snap back to current or nearest
                updateSlider();
            }
        });

        function animation() {
            if (isDragging) {
                requestAnimationFrame(animation);
            }
        }

        // Handle window resize to adjust slider
        window.addEventListener('resize', () => {
            cardWidth = projectCards[0].offsetWidth + (parseFloat(getComputedStyle(projectCards[0]).marginLeft) * 2);
            updateSlider();
        });
    };

    navSlide();
    setupSmoothScrolling();
    setupProjectSlider();
});