document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const flyerGrid = document.getElementById('flyer-grid');

    // Fungsi untuk render gallery dengan deteksi perubahan
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
});