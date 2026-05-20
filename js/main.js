document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');

    // Pastikan array window.galleryPhotos (dari Python) tersedia
    if (window.galleryPhotos && window.galleryPhotos.length > 0) {
        window.galleryPhotos.forEach(photoPath => {
            // Buat elemen foto
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-card fade-in';
            
            photoDiv.innerHTML = `
                <img src="${photoPath}" alt="Gallery Image" loading="lazy">
            `;
            
            galleryGrid.appendChild(photoDiv);
        });
    } else {
        // TAMPILAN JIKA KOSONG: Kotak Blank Abu-abu + Logo Kamera
        // Perhatikan penambahan class 'empty-gallery' di bawah ini
        galleryGrid.innerHTML = `
            <div class="empty-gallery w-full h-80 bg-gray-300 border-2 border-gray-800 shadow-[6px_6px_0px_#1f2937] flex flex-col items-center justify-center text-gray-500 transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#1f2937]">
                <i class="fa-solid fa-camera-retro text-6xl mb-3 opacity-40"></i>
                <p class="font-bold tracking-widest uppercase text-sm opacity-50">No Image Loaded</p>
            </div>
        `;
    }
});