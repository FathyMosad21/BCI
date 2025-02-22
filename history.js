// Add this to your history.js file

// Function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animate timeline items when they come into view
function animateOnScroll() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        if (isInViewport(item)) {
            item.classList.add('visible');
        }
    });
}

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);
// Initial check for visible elements
window.addEventListener('load', animateOnScroll);
