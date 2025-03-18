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
}); 