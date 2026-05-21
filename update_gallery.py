import os
import json
from PIL import Image

# Konfigurasi
GALLERY_DIR = 'img/gallery'
FLYER_DIR = 'img/flyer'
OUTPUT_FILE = 'js/gallery_data.js'
MAX_WIDTH = 1200 # Lebar maksimal, cukup untuk layar HD
MAX_FILE_SIZE = 100 * 1024  # 100 KB dalam bytes

def compress_to_limit(image, filepath, quality_start=80):
    """Kompresi gambar agar ukuran file tidak melebihi 100KB"""
    quality = quality_start
    min_quality = 20  # Quality minimum sebelum resize
    
    while quality >= min_quality:
        # Convert RGB jika perlu
        if image.mode in ("RGBA", "P"):
            img_rgb = image.convert("RGB")
        else:
            img_rgb = image
        
        # Save dengan quality saat ini
        img_rgb.save(filepath, 'WEBP', quality=quality)
        
        # Check file size
        file_size = os.path.getsize(filepath)
        
        if file_size <= MAX_FILE_SIZE:
            return True, quality, file_size
        
        # Jika masih terlalu besar, kurangi quality
        quality -= 5
    
    # Jika quality sudah minimum tapi masih besar, resize image
    print(f"    ⚠️  Quality sudah minimum ({min_quality}), mencoba resize...")
    
    # Resize hingga masuk ke 100KB
    scale = 0.9
    max_resize_attempts = 10
    attempt = 0
    
    while attempt < max_resize_attempts:
        new_width = int(image.width * scale)
        new_height = int(image.height * scale)
        
        resized = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Convert RGB dan save dengan quality minimum
        if resized.mode in ("RGBA", "P"):
            resized = resized.convert("RGB")
        
        resized.save(filepath, 'WEBP', quality=min_quality)
        file_size = os.path.getsize(filepath)
        
        if file_size <= MAX_FILE_SIZE:
            return True, min_quality, file_size
        
        # Kurangi ukuran lagi
        scale *= 0.9
        attempt += 1
    
    # Jika masih belum berhasil setelah resize, warn tapi tetap simpan
    print(f"    ⚠️  Tidak bisa kompresi di bawah 100KB ({file_size / 1024:.1f}KB), disimpan seadanya")
    return False, min_quality, file_size

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
                
                # Kompresi hingga di bawah 100KB
                success, final_quality, file_size = compress_to_limit(img, new_filepath, quality_start=80)
                
                # Hapus foto asli
                os.remove(filepath)
                
                size_kb = file_size / 1024
                status_icon = "✅" if success else "⚠️"
                print(f"{status_icon} {category_name}: {filename} -> {new_filename} ({size_kb:.1f}KB, quality={final_quality})")
                
                photos.append(f"{directory}/{new_filename}")
                added_count += 1
            except Exception as e:
                print(f"❌ Gagal memproses {category_name}/{filename}: {e}")
                
        # Jika file sudah berupa WebP, check ukuran dan re-kompresi jika perlu
        elif filename.lower().endswith('.webp'):
            filepath = os.path.join(directory, filename)
            file_size = os.path.getsize(filepath)
            
            # Jika file WebP melebihi 100KB, re-kompresi
            if file_size > MAX_FILE_SIZE:
                try:
                    img = Image.open(filepath)
                    # Resize jika resolusi terlalu "raksasa"
                    if img.width > MAX_WIDTH:
                        ratio = MAX_WIDTH / img.width
                        new_height = int(img.height * ratio)
                        img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                    
                    # Re-kompresi dengan target 100KB
                    success, final_quality, new_size = compress_to_limit(img, filepath, quality_start=80)
                    
                    size_kb_before = file_size / 1024
                    size_kb_after = new_size / 1024
                    status_icon = "✅" if success else "⚠️"
                    print(f"{status_icon} Re-kompresi {category_name}: {filename} ({size_kb_before:.1f}KB → {size_kb_after:.1f}KB, quality={final_quality})")
                    
                except Exception as e:
                    print(f"❌ Gagal re-kompresi {category_name}/{filename}: {e}")
            
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