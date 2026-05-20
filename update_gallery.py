import os
import json
from PIL import Image

# Konfigurasi
GALLERY_DIR = 'img/gallery'
FLYER_DIR = 'img/flyer'
OUTPUT_FILE = 'js/gallery_data.js'
MAX_WIDTH = 1200 # Lebar maksimal, cukup untuk layar HD

def process_directory(directory, category_name):
    """Proses foto dari direktori dan return list foto WebP + status"""
    os.makedirs(directory, exist_ok=True)
    photos = []
    added_count = 0
    deleted_count = 0
    
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        
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
                new_filepath = os.path.join(directory, new_filename)
                
                # Convert RGB jika PNG transparan (opsional, untuk mencegah error)
                if img.mode in ("RGBA", "P"): img = img.convert("RGB")
                
                img.save(new_filepath, 'WEBP', quality=80)
                
                # Hapus foto asli
                os.remove(filepath)
                print(f"✅ Kompresi {category_name}: {filename} -> {new_filename}")
                photos.append(f"{directory}/{new_filename}")
                added_count += 1
            except Exception as e:
                print(f"❌ Gagal memproses {category_name}/{filename}: {e}")
                
        # Jika file sudah berupa WebP, langsung daftarkan
        elif filename.lower().endswith('.webp'):
            photos.append(f"{directory}/{filename}")
    
    return photos, len(photos) == 0, added_count

def optimize_and_update():
    print("📸 Memproses galeri...\n")
    
    # Proses kedua direktori
    gallery_photos, gallery_empty, gallery_added = process_directory(GALLERY_DIR, 'Documentation')
    flyer_photos, flyer_empty, flyer_added = process_directory(FLYER_DIR, 'Flyer Design')

    # Buat file JS penyambung dengan informasi lengkap
    os.makedirs('js', exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        f.write(f"// Auto-generated gallery data\n")
        f.write(f"window.galleryPhotos = {json.dumps(gallery_photos)};\n")
        f.write(f"window.flyerPhotos = {json.dumps(flyer_photos)};\n")
        f.write(f"window.galleryStatus = {{\n")
        f.write(f"  isEmpty: {str(gallery_empty).lower()},\n")
        f.write(f"  count: {len(gallery_photos)},\n")
        f.write(f"  lastUpdate: '{get_timestamp()}'\n")
        f.write(f"}};\n")
        f.write(f"window.flyerStatus = {{\n")
        f.write(f"  isEmpty: {str(flyer_empty).lower()},\n")
        f.write(f"  count: {len(flyer_photos)},\n")
        f.write(f"  lastUpdate: '{get_timestamp()}'\n")
        f.write(f"}};\n")
    
    # Status laporan
    print("\n" + "="*50)
    print("📊 LAPORAN UPDATE")
    print("="*50)
    print(f"📷 Documentation: {len(gallery_photos)} foto", end="")
    if gallery_empty:
        print(" (KOSONG) ⚠️")
    else:
        print(f" (+{gallery_added} ditambahkan)")
    
    print(f"🎨 Flyer Design: {len(flyer_photos)} foto", end="")
    if flyer_empty:
        print(" (KOSONG) ⚠️")
    else:
        print(f" (+{flyer_added} ditambahkan)")
    
    print("="*50)
    print("✅ Semua otomatis terupdate di web!")

def get_timestamp():
    """Return timestamp untuk tracking"""
    from datetime import datetime
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

if __name__ == "__main__":
    optimize_and_update()