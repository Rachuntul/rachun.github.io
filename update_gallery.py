import os
import json
from PIL import Image

# Konfigurasi
GALLERY_DIR = 'img/gallery'
OUTPUT_FILE = 'js/gallery_data.js'
MAX_WIDTH = 1200 # Lebar maksimal, cukup untuk layar HD

def optimize_and_update():
    os.makedirs(GALLERY_DIR, exist_ok=True)
    photos = []
    
    for filename in os.listdir(GALLERY_DIR):
        filepath = os.path.join(GALLERY_DIR, filename)
        
        # Lewati folder atau file tersembunyi
        if not os.path.isfile(filepath) or filename.startswith('.'): 
            continue
            
        # Jika file JPG/PNG, kita kompres dan convert ke WebP
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            try:
                img = Image.open(filepath)
                # Resize jika resolusi terlalu "raksasa"
                if img.width > MAX_WIDTH:
                    ratio = MAX_WIDTH / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                
                # Simpan sebagai WebP
                new_filename = os.path.splitext(filename)[0] + '.webp'
                new_filepath = os.path.join(GALLERY_DIR, new_filename)
                
                # Convert RGB jika PNG transparan (opsional, untuk mencegah error)
                if img.mode in ("RGBA", "P"): img = img.convert("RGB")
                
                img.save(new_filepath, 'WEBP', quality=80) # Quality 80 itu sweet spot!
                
                # Hapus foto asli biar irit storage repo GitHub kamu
                os.remove(filepath)
                print(f"✅ Kompresi Berhasil: {filename} -> {new_filename}")
                photos.append(f"{GALLERY_DIR}/{new_filename}")
            except Exception as e:
                print(f"❌ Gagal memproses {filename}: {e}")
                
        # Jika file sudah berupa WebP, langsung daftarkan
        elif filename.lower().endswith('.webp'):
            photos.append(f"{GALLERY_DIR}/{filename}")

    # Buat file JS penyambung
    os.makedirs('js', exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        f.write(f"window.galleryPhotos = {json.dumps(photos)};")
    
    print(f"🚀 Selesai! {len(photos)} foto WebP siap diluncurkan.")

if __name__ == "__main__":
    optimize_and_update()