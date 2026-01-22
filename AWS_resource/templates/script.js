
// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Header Background on Scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Form Validation and Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const location = formData.get('location');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !location || !subject || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Submit form
        fetch('contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
            } else {
                alert('Sorry, there was an error sending your message. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Sorry, there was an error sending your message. Please try again.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
const animateElements = document.querySelectorAll('.stat-card, .process-card, .portfolio-card, .blog-card, .service-card');

animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Counter Animation for Statistics
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('Y.') ? ' Y.' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('Y.') ? ' Y.' : '');
        }
    }, 16);
};

const statNumbers = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.stats');

if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    if (number && !stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateCounter(stat, number, 2000);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// Testimonial Carousel (Simple version)
let currentTestimonial = 0;
const testimonials = [
    {
        quote: "From the initial consultation to the final delivery, every step was handled professionally. The infrastructure automation and CI/CD pipeline implementation transformed our development process. The end result was a system that not only met our needs but also impressed our stakeholders. Highly recommended!",
        author: "John Smith",
        company: "CTO, Tech Solutions Inc."
    },
    {
        quote: "Working with this DevOps engineer was a game-changer for our organization. The cloud migration was seamless, and the automation solutions have significantly improved our deployment speed. Excellent communication and technical expertise!",
        author: "Sarah Johnson",
        company: "VP Engineering, CloudTech Corp"
    },
    {
        quote: "The Kubernetes implementation and monitoring setup exceeded our expectations. Our infrastructure is now more reliable and scalable than ever. I would definitely recommend their services to any company looking to modernize their DevOps practices.",
        author: "Michael Chen",
        company: "Founder, StartupXYZ"
    }
];

const testimonialDots = document.querySelectorAll('.testimonial-pagination .dot');
const testimonialQuote = document.querySelector('.testimonial-quote');
const testimonialAuthor = document.querySelector('.testimonial-author h4');
const testimonialCompany = document.querySelector('.testimonial-author p');

if (testimonialDots.length > 0) {
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            updateTestimonial();
        });
    });

    function updateTestimonial() {
        if (testimonialQuote && testimonialAuthor && testimonialCompany) {
            testimonialQuote.textContent = testimonials[currentTestimonial].quote;
            testimonialAuthor.textContent = testimonials[currentTestimonial].author;
            testimonialCompany.textContent = testimonials[currentTestimonial].company;

            testimonialDots.forEach((dot, index) => {
                if (index === currentTestimonial) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonial();
    }, 5000);
}

// Blog Carousel (Simple version)
let currentBlogPage = 0;
const blogDots = document.querySelectorAll('.blog-pagination .dot');

if (blogDots.length > 0) {
    blogDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentBlogPage = index;
            updateBlogPage();
        });
    });

    function updateBlogPage() {
        blogDots.forEach((dot, index) => {
            if (index === currentBlogPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// Add active class to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
