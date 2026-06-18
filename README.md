# 📸 Dion Puji Ramdani - Portfolio Archive

Portofolio personal yang menampilkan koleksi fotografi dan desain grafis dengan layout masonry yang responsif.

🌐 **Live Demo:** https://rachuntul.github.io/rachun.github.io/

## ✨ Fitur

- **Responsive Masonry Layout** - Tata letak Pinterest-style yang otomatis menyesuaikan dengan ukuran layar
- **Dark Mode** - Tema gelap yang nyaman untuk mata, tersimpan di localStorage
- **Lazy Loading** - Gambar dimuat saat scroll untuk performa lebih baik
- **Dynamic Aspect Ratio** - Card otomatis menyesuaikan dengan bentuk dan ratio gambar asli
- **Smooth Navigation** - Navigasi halus dengan smooth scrolling antar section
- **Fully Responsive** - Optimal di mobile, tablet, dan desktop
- **WebP Format** - Gambar dioptimalkan untuk loading cepat

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Framework**: Tailwind CSS (CDN)
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Space Grotesk)
- **Hosting**: GitHub Pages
- **Build Tools**: Python script untuk auto-generate gallery data

## 📁 Struktur Project

```
.
├── index.html                   # Entry point utama
├── README.md                    # Dokumentasi project
├── GITHUB_PAGES_CHECKLIST.md   # GitHub Pages configuration
├── update_gallery.py            # Script untuk generate gallery_data.js
├── css/
│   └── style.css               # Custom styling & Catppuccin Mocha theme
├── js/
│   ├── main.js                 # Core functionality
│   └── gallery_data.js         # Auto-generated gallery data
└── img/
    ├── gallery/                # Photo collection
    ├── flyer/                  # Design projects
    └── profile/                # Profile image
```

## 🚀 Cara Menggunakan

### Development Lokal
1. Clone repository:
```bash
git clone https://github.com/Rachuntul/rachuntul.github.io.git
cd rachuntul.github.io
```

2. Update galeri setelah menambah foto:
```bash
python update_gallery.py
```

3. Buka di browser:
```bash
# Menggunakan Python SimpleServer
python -m http.server 8000

# Atau gunakan Live Server extension di VS Code
```

### Deployment ke GitHub Pages
1. Commit perubahan:
```bash
git add .
git commit -m "Update gallery"
```

2. Push ke main branch:
```bash
git push origin main
```

GitHub Pages akan otomatis deploy! 🎉

## 📸 Menambahkan Foto Baru

1. **Tambahkan foto** ke:
   - `img/gallery/` untuk fotografi
   - `img/flyer/` untuk desain

2. **Optimalkan format**:
   - Gunakan WebP format untuk file size lebih kecil
   - Recommended: 1200x1800px untuk landscape, 800x1200px untuk portrait

3. **Generate ulang data**:
```bash
python update_gallery.py
```

4. **Commit dan push**:
```bash
git add .
git commit -m "Add new photos"
git push origin main
```

## 🎨 Kustomisasi

### Mengubah Tema Warna
Edit variabel CSS di `css/style.css`:
```css
:root {
    --saweria-yellow: #ffd700; /* Edit warna di sini */
    /* ... variabel lainnya */
}
```

### Mengubah Jumlah Kolom
Edit media queries di `css/style.css`:
```css
@media (min-width: 1280px) { 
    .masonry-gallery { 
        column-count: 3; /* 3 kolom untuk desktop */
    } 
}
```

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Lisensi

Project ini dibuat sebagai portofolio personal. Silakan lihat LICENSE file untuk detail lebih lanjut.

## 👤 Tentang Penulis

**Dion Puji Ramdani**
- 📸 Junior Photographer
- 🎨 Graphic Designer
- 🔗 [GitHub](https://github.com/Rachuntul)
- 📱 [Instagram](https://instagram.com/dionimbus/)
- 🎵 [TikTok](https://www.tiktok.com/@diyooman)
- 📧 [Email](mailto:dionpuji12@gmail.com)
- ☕ [Support me](https://saweria.co/RACHUN)

---

Made with ❤️ by Dion Puji Ramdani