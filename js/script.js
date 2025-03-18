document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate stat counters when they come into view
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Intersection Observer for stat counters
    const observerOptions = {
        threshold: 0.1
    };
    
    const statsObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const targetCount = parseInt(statElement.dataset.count);
                
                animateCount(statElement, targetCount);
                
                // Unobserve after animation starts
                observer.unobserve(statElement);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Function to animate counting
    function animateCount(element, target) {
        let count = 0;
        const duration = 2000; // 2 seconds
        const frameRate = 30; // frames per second
        const totalFrames = duration / 1000 * frameRate;
        const increment = target / totalFrames;
        
        const counter = setInterval(() => {
            count += increment;
            
            if (count >= target) {
                element.textContent = formatNumber(target);
                clearInterval(counter);
            } else {
                element.textContent = formatNumber(Math.floor(count));
            }
        }, 1000 / frameRate);
        
        // Add animation class
        element.style.animation = 'countUp 1s ease-out forwards';
    }
    
    // Format large numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Add mobile navigation styles dynamically
    if (window.innerWidth <= 768) {
        const style = document.createElement('style');
        style.textContent = `
            .nav-links.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: white;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
                z-index: 100;
            }
            
            .nav-links.active li {
                margin: 15px 0;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add placeholder behavior for images
    const placeholderImages = document.querySelectorAll('.placeholder-img');
    placeholderImages.forEach(img => {
        if (!img.src || img.src.endsWith('placeholder-img')) {
            img.textContent = 'Image placeholder';
        }
    });

    // Carousel functionality
    const track = document.querySelector('.profiles-track');
    const cards = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    // Calculate how many cards to show based on screen width
    const getCardsToShow = () => {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    };

    let cardsToShow = getCardsToShow();
    let currentIndex = 0;

    // Create dots
    const createDots = () => {
        dotsContainer.innerHTML = '';
        const numberOfDots = Math.ceil(cards.length / cardsToShow);
        
        for (let i = 0; i < numberOfDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dotsContainer.appendChild(dot);
        }
    };

    // Update dots
    const updateDots = () => {
        const dots = Array.from(dotsContainer.children);
        const currentDot = Math.floor(currentIndex / cardsToShow);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentDot);
        });
    };

    // Move to slide
    const moveToSlide = (index) => {
        currentIndex = index;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 30; // matches the gap in CSS
        track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
        updateDots();
        
        // Update button states
        prevButton.style.opacity = index === 0 ? '0.5' : '1';
        prevButton.style.cursor = index === 0 ? 'not-allowed' : 'pointer';
        
        const lastPossibleIndex = cards.length - cardsToShow;
        nextButton.style.opacity = index >= lastPossibleIndex ? '0.5' : '1';
        nextButton.style.cursor = index >= lastPossibleIndex ? 'not-allowed' : 'pointer';
    };

    // Initialize carousel
    createDots();
    moveToSlide(0);

    // Event listeners
    nextButton.addEventListener('click', () => {
        const lastPossibleIndex = cards.length - cardsToShow;
        if (currentIndex < lastPossibleIndex) {
            moveToSlide(currentIndex + 1);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        }
    });

    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-dot')) {
            const dots = Array.from(dotsContainer.children);
            const dotIndex = dots.indexOf(e.target);
            moveToSlide(dotIndex * cardsToShow);
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newCardsToShow = getCardsToShow();
            if (newCardsToShow !== cardsToShow) {
                cardsToShow = newCardsToShow;
                createDots();
                moveToSlide(0);
            }
        }, 250);
    });
});

// Stats counter animation
document.addEventListener('DOMContentLoaded', function() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50; // Divide animation into 50 steps
        const duration = 2000; // 2 seconds
        const stepTime = duration / 50;
        
        const counter = setInterval(() => {
            current += increment;
            if (current > target) {
                element.textContent = target.toLocaleString();
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, stepTime);
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.5
    });

    stats.forEach(stat => observer.observe(stat));
}); 