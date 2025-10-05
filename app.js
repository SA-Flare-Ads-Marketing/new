// Select ALL hero sections for showing/hiding logic
const allHeroSections = document.querySelectorAll('.hero-section');
// Select ONLY the sections that are part of the automatic rotation cycle
const rotatingHeroSections = document.querySelectorAll('.hero-section:not(#hero)'); 

// Get a reference to the static hero section
const staticHeroSection = document.getElementById('hero');

let currentSlideIndex = 0;
const totalSlides = rotatingHeroSections.length;
const slideDuration = 3000; // 5000 milliseconds = 5 seconds

/**
 * Sets the visibility of the hero slides by toggling the 'active' class.
 * @param {number} index - The index of the slide to activate within the rotatingHeroSections array.
 */
function showSlide(index) {
    // 1. Deactivate the current rotating slide (initiate fade-out)
    const currentActiveSlide = document.querySelector('.hero-section:not(#hero).active');
    if (currentActiveSlide) {
        currentActiveSlide.classList.remove('active');
    }
    
    // 2. Ensure the static hero section is hidden and non-interactive
    if (staticHeroSection) {
        staticHeroSection.classList.add('hidden-hero');
    }

    // 3. Activate the new rotating slide (initiate fade-in)
    const nextSlide = rotatingHeroSections[index];
    if (nextSlide) {
        nextSlide.classList.add('active');
    }
    
    // 4. Update the index for the next cycle
    currentSlideIndex = index;
}

/**
 * Cycles to the next slide.
 */
function nextSlide() {
    let nextIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(nextIndex);
}

// Start the rotation once the entire document is loaded.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State: Show the static hero section
    if (staticHeroSection) {
        // Ensure the static section is visible initially
        staticHeroSection.classList.add('active'); 
        staticHeroSection.classList.remove('hidden-hero'); 
    }
    
    // 2. Delayed Rotation Start
    if (rotatingHeroSections.length > 0) {
        setTimeout(() => {
            // Fade out the static section by adding the hidden class
            if (staticHeroSection) {
                staticHeroSection.classList.remove('active'); 
                staticHeroSection.classList.add('hidden-hero'); 
            }
            
            // Wait for the fade out to complete (1 second transition in CSS)
            setTimeout(() => {
                // Now, start the rotation
                showSlide(0); 
                
                // Start the interval for subsequent slides
                setInterval(nextSlide, slideDuration);
            }, 500); // Match CSS transition duration
            
        }, slideDuration); // Wait for the initial static slide duration before starting rotation
    } 
});
/* ======================================= */
/* COUNTER ANIMATION FOR STATS SECTION */
/* ======================================= */
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the number, the faster the count

    // Function to start the counter animation
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const initialText = counter.textContent; // Store original text (like '0k', '0b+')
        const unit = initialText.match(/[^0-9.]/g) ? initialText.match(/[^0-9.]/g).join('') : ''; // Get the unit ('k' or 'b+')

        let current = 0;
        let increment = target / speed;

        const updateCount = () => {
            current += increment;

            if (current < target) {
                // For float numbers, round to one decimal place
                counter.textContent = current.toFixed(current % 1 !== 0 && target % 1 !== 0 ? 1 : 0) + unit;
                setTimeout(updateCount, 1);
            } else {
                // Ensure the final value is exactly the target
                counter.textContent = target + unit;
            }
        };

        updateCount();
    };

    // Observer to start the animation when the stats section comes into view
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    // Only run the animation once
                    if (counter.getAttribute('data-target') !== 'completed') {
                        animateCounter(counter);
                        counter.setAttribute('data-target', 'completed'); // Mark as completed
                    }
                });
                observer.unobserve(entry.target); // Stop observing after animation starts
            }
        });
    }, {
        threshold: 0.5 // Start animation when 50% of the section is visible
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
/* ======================================= */
// --- TESTIMONIAL CAROUSEL LOGIC ---

function initializeTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    const cards = carousel ? carousel.querySelectorAll('.testimonial-card') : [];
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoRotateInterval;
    const rotateDuration = 7000; // 7 seconds per slide

    if (totalCards === 0 || !carousel) return; // Exit if no testimonials or carousel found

    // 1. Create Dots and initial active state
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => {
            showTestimonial(i);
            resetAutoRotate(); // Reset timer when user manually navigates
        });
        dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.dot');

    // 2. Function to show a specific testimonial card
    function showTestimonial(index) {
        // Calculate the actual index (looping)
        if (index >= totalCards) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalCards - 1;
        } else {
            currentIndex = index;
        }

        // Move the carousel
        const offset = -currentIndex * 100; // Assumes each card is 100% of the carousel's width
        carousel.style.transform = `translateX(${offset}%)`;

        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }
    
    // 3. Navigation Handlers
    prevBtn.addEventListener('click', () => {
        showTestimonial(currentIndex - 1);
        resetAutoRotate();
    });
    
    nextBtn.addEventListener('click', () => {
        showTestimonial(currentIndex + 1);
        resetAutoRotate();
    });

    // 4. Auto-Rotate and Reset Logic
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, rotateDuration);
    }

    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    // Initial load and start rotation
    showTestimonial(0); 
    startAutoRotate();
}

// Ensure you call this function on load in your DOMContentLoaded listener

document.addEventListener('DOMContentLoaded', () => {
    // ... [Your existing hero rotation logic goes here] ...

    // Initialize the Testimonial Carousel
    initializeTestimonialCarousel(); 
});
 document.addEventListener('DOMContentLoaded', () => {
            // --- Tab/Navigation Functionality ---
            const navItems = document.querySelectorAll('.faq-nav-item');
            const faqPages = document.querySelectorAll('.faq-page');

            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = item.getAttribute('data-target');

                    // Remove active class from all nav items and pages
                    navItems.forEach(nav => nav.classList.remove('active'));
                    faqPages.forEach(page => page.classList.remove('active'));

                    // Add active class to the clicked nav item and corresponding page
                    item.classList.add('active');
                    document.getElementById(targetId).classList.add('active');

                    // Update URL hash without causing a page reload
                    window.location.hash = item.getAttribute('href');
                });
            });

            // Handle URL hash on load
            const hash = window.location.hash.substring(1); // Get hash without '#'
            if (hash) {
                const targetItem = document.querySelector(`.faq-nav-item[href="#${hash}"]`);
                if (targetItem) {
                    targetItem.click(); // Programmatically click the tab
                }
            } else {
                 // Default to showing the first tab if no hash is present
                 document.querySelector('.faq-nav-item').click();
            }


            // --- Accordion Functionality ---
            const accordionHeaders = document.querySelectorAll('.accordion-header');

            accordionHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const item = header.closest('.accordion-item');
                    const isActive = item.classList.contains('active');

                    // Optional: Close all other open items
                    document.querySelectorAll('.accordion-item.active').forEach(openItem => {
                        if (openItem !== item) {
                            openItem.classList.remove('active');
                        }
                    });

                    // Toggle the active class on the clicked item
                    item.classList.toggle('active');
                });
            });
        });
        // ===================================
// EK-Alpha Solutions - Loading Screen
// ===================================

document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen")

  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.classList.add("hidden")
      // Remove from DOM after animation completes
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }, 1500) // Show loading screen for 1.5 seconds
  })

  console.log("[v0] Loading screen initialized")
})
// ===================================
// EK-Alpha Solutions - Scroll to Top Button
// ===================================

document.addEventListener("DOMContentLoaded", () => {
  // Create back to top button
  const backToTopBtn = document.createElement("button")
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
  backToTopBtn.className = "back-to-top"
  backToTopBtn.setAttribute("aria-label", "Scroll to top")
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: linear-gradient(45deg, red,blue);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    font-size: 18px;
  `

  document.body.appendChild(backToTopBtn)

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = "1"
      backToTopBtn.style.visibility = "visible"
    } else {
      backToTopBtn.style.opacity = "0"
      backToTopBtn.style.visibility = "hidden"
    }
  })

  // Scroll to top on click
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Add hover effect
  backToTopBtn.addEventListener("mouseenter", () => {
    backToTopBtn.style.transform = "scale(1.1)"
  })

  backToTopBtn.addEventListener("mouseleave", () => {
    backToTopBtn.style.transform = "scale(1)"
  })

  console.log("[v0] Scroll to top button initialized")
})
// app.js

// --- Navbar Opacity on Scroll Up/Down Functionality ---

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0; // Tracks the previous scroll position

if (navbar) {
    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check if the user is scrolling past the very top of the page
        if (currentScroll > 0) {
            // SCROLLING DOWN: Hide navbar completely (invisible and non-clickable)
            if (currentScroll > lastScrollTop) {
                navbar.style.opacity = '0';
                navbar.style.visibility = 'hidden';
            } 
            // SCROLLING UP: Show navbar with full opacity
            else if (currentScroll < lastScrollTop) {
                navbar.style.opacity = '1';
                navbar.style.visibility = 'visible';
            }
        } else {
            // At the very top (scroll position is 0), make it fully visible
            navbar.style.opacity = '1';
            navbar.style.visibility = 'visible';
        }
        
        // Update the last scroll position for the next check
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}
// --- Mobile Navbar Toggle Logic ---

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Check if both elements exist before adding the listener
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            // This toggles the 'active' class on the navigation links
            navLinks.classList.toggle('active');
            
            // OPTIONAL: Change the icon from bars (☰) to times (✕)
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        console.log("[v1] Mobile menu toggle initialized.");
    }
});