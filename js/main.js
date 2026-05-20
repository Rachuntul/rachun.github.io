// ============================================
// DARK MODE TOGGLE
// ============================================
const initDarkMode = () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const html = document.documentElement;
    
    // Check preference: localStorage > system preference > default (light)
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedMode ? JSON.parse(savedMode) : prefersDark;
    
    // Apply saved preference
    if (isDarkMode) {
        document.body.classList.add('dark');
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const newMode = document.body.classList.contains('dark');
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    });
};

// ============================================
// NAVIGATION & SMOOTH SCROLL
// ============================================
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
    
    // Update active button on scroll
    window.addEventListener('scroll', () => {
        updateActiveButtonOnScroll();
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
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-target') === currentSection) {
            button.classList.add('active');
        }
    });
};

// ============================================
// GALLERY RENDER
// ============================================
const renderGallery = (gridElement, photosArray, statusObj, categoryName) => {
    // Jika tidak ada foto sama sekali
    if (!photosArray || photosArray.length === 0 || (statusObj && statusObj.isEmpty)) {
        gridElement.innerHTML = `
            <div class="empty-gallery w-full h-80 bg-gray-300 border-2 border-gray-800 shadow-[6px_6px_0px_#1f2937] flex flex-col items-center justify-center text-gray-500 transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#1f2937]">
                <i class="fa-solid fa-camera-retro text-6xl mb-3 opacity-40"></i>
                <p class="font-bold tracking-widest uppercase text-sm opacity-50">No ${categoryName} Loaded</p>
            </div>
        `;
        return;
    }

    // Clear grid terlebih dahulu
    gridElement.innerHTML = '';

    // Render semua foto
    photosArray.forEach(photoPath => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-card fade-in';
        
        photoDiv.innerHTML = `
            <img src="${photoPath}" alt="${categoryName} Image" loading="lazy">
        `;
        
        gridElement.appendChild(photoDiv);
    });
};

// ============================================
// MAIN INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode first
    initDarkMode();
    
    // Initialize navigation
    initNavigation();
    
    const galleryGrid = document.getElementById('gallery-grid');
    const flyerGrid = document.getElementById('flyer-grid');

    // Render Documentation Gallery
    renderGallery(
        galleryGrid, 
        window.galleryPhotos, 
        window.galleryStatus,
        'Image'
    );

    // Render Flyer Design Gallery
    renderGallery(
        flyerGrid, 
        window.flyerPhotos, 
        window.flyerStatus,
        'Design'
    );

    // Debug: Log status (optional, bisa dihapus nanti)
    if (window.galleryStatus) {
        console.log('Gallery Status:', window.galleryStatus);
    }
    if (window.flyerStatus) {
        console.log('Flyer Status:', window.flyerStatus);
    }
    
    // Set initial active button (Home)
    const homeButton = document.querySelector('[data-target="home"]');
    if (homeButton) {
        homeButton.classList.add('active');
    }
});