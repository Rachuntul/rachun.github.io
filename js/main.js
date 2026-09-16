// ==========================================================================
// DION PUJI RAMDANI - ARCHIVE
// Flat 2-Tone 3D Design & Solar Transit Engine (East to West Sun Movement)
// ==========================================================================

let isSunTransitActive = false;

/**
 * Triggers the Solar Transit Effect:
 * The sun moves across the sky from East to West, dynamically casting
 * rotating 3D shadows across all slabs, cards, and buttons.
 * @param {boolean} targetIsDark - Target theme state
 */
const triggerSunTransit = (targetIsDark) => {
    if (isSunTransitActive) return;
    isSunTransitActive = true;

    const body = document.body;
    const transitClass = targetIsDark ? 'sun-transit-to-dark' : 'sun-transit-to-light';

    // Remove any lingering transit classes and trigger reflow
    body.classList.remove('sun-transit-to-light', 'sun-transit-to-dark');
    void body.offsetWidth;

    // Apply transit animation class
    body.classList.add(transitClass);

    // Toggle dark class immediately for color transition harmony
    if (targetIsDark) {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }

    // Save user choice to localStorage
    localStorage.setItem('darkMode', JSON.stringify(targetIsDark));

    // After transit animation completes (1.35s), remove class to restore normal hover states
    setTimeout(() => {
        body.classList.remove(transitClass);
        isSunTransitActive = false;
    }, 1350);
};

/**
 * Initializes Dark Mode and registers listener on Theme Toggle Button
 */
const initDarkMode = () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Check saved preference: localStorage > system preference
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedMode !== null ? JSON.parse(savedMode) : prefersDark;
    
    // Set initial mode
    if (isDarkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    // Click listener on single theme toggle button (Sun <-> Moon)
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const willBeDark = !document.body.classList.contains('dark');
            triggerSunTransit(willBeDark);
        });
    }
};

/**
 * Smooth navigation and active button tracker
 */
const initNavigation = () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateActiveNavButton(button);
            }
        });
    });
    
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                updateActiveButtonOnScroll();
                scrollTimeout = null;
            }, 50);
        }
    });
};

const updateActiveNavButton = (button) => {
    const allButtons = document.querySelectorAll('.nav-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
};

const updateActiveButtonOnScroll = () => {
    const sections = document.querySelectorAll('.scroll-section');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    let currentSection = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        
        if (scrollPos >= top && scrollPos < top + height + 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    if (currentSection) {
        navButtons.forEach(button => {
            if (button.getAttribute('data-target') === currentSection) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
};

/**
 * Renders the gallery photos into the masonry layout with Flat 3D cards
 */
const renderGallery = (gridElement, photosArray, statusObj, categoryName, badgeId) => {
    if (!gridElement) return;

    // Update count badge
    if (badgeId) {
        const badge = document.getElementById(badgeId);
        if (badge) {
            const count = photosArray ? photosArray.length : 0;
            const unit = categoryName === 'Image' ? 'SHOTS' : 'WORKS';
            badge.textContent = `${count} ${unit}`;
        }
    }

    // Empty state
    if (!photosArray || photosArray.length === 0 || (statusObj && statusObj.isEmpty)) {
        gridElement.innerHTML = `
            <div class="empty-gallery">
                <i class="fa-solid fa-camera-retro"></i>
                <p class="font-extrabold uppercase tracking-widest text-sm">Tidak Ada ${categoryName} Dimuat</p>
            </div>
        `;
        return;
    }

    gridElement.innerHTML = '';

    // Render 3D Photo Cards
    photosArray.forEach((photoPath, index) => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card card-3d fade-in';
        
        const inner = document.createElement('div');
        inner.className = 'photo-card-inner';

        const img = document.createElement('img');
        img.src = photoPath;
        img.alt = `${categoryName} #${index + 1}`;
        img.loading = 'lazy';

        const tag = document.createElement('div');
        tag.className = 'photo-tag-3d';
        tag.textContent = `#${String(index + 1).padStart(2, '0')}`;

        inner.appendChild(img);
        inner.appendChild(tag);
        photoCard.appendChild(inner);
        gridElement.appendChild(photoCard);
    });
};

// ==========================================================================
// APPLICATION INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Dark Mode & Sun Transit
    initDarkMode();
    
    // 2. Initialize Navigation
    initNavigation();
    
    // 3. Render Photo Gallery (Documentation)
    const galleryGrid = document.getElementById('gallery-grid');
    renderGallery(
        galleryGrid, 
        window.galleryPhotos, 
        window.galleryStatus,
        'Image',
        'photo-count-badge'
    );

    // 4. Render Design Gallery (Flyer)
    const flyerGrid = document.getElementById('flyer-grid');
    renderGallery(
        flyerGrid, 
        window.flyerPhotos, 
        window.flyerStatus,
        'Design',
        'design-count-badge'
    );
    
    // Set initial active nav button
    const homeBtn = document.querySelector('.nav-btn[data-target="home"]');
    if (homeBtn) {
        homeBtn.classList.add('active');
    }
});