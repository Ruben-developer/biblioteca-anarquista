#!/usr/bin/env python3
"""Phase 3: Reorganize pdfs-local/ into flat pdfs/ structure."""
import json, os, shutil, re, unicodedata

PDFS_LOCAL = '/home/fdr/biblioteca-anarquista/pdfs-local'
NEW_FLAT = os.path.join(PDFS_LOCAL, 'pdfs')
CATALOG = '/tmp/all_books.json'
ZIP_PDFS = '/home/fdr/Documentos/anarquismo_importado/biblioteca-inv/pdfs'
MAPPING_FILE = '/home/fdr/Documentos/anarquismo_importado/biblioteca-inv/filename_mapping.json'

os.makedirs(NEW_FLAT, exist_ok=True)

with open(CATALOG) as f:
    data = json.load(f)
catalog = data['books']

def clean_name(name):
    """Normalize filename to Autor - Titulo (Año).pdf"""
    # Remove accents
    name = unicodedata.normalize('NFD', name)
    name = ''.join(c for c in name if unicodedata.category(c) != 'Mn')
    # Replace problematic chars
    name = re.sub(r'[^\w\s\-.,()áéíóúñüÁÉÍÓÚÑÜ]', '', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name

# Build catalog lookup: old_filename -> new_filename
mapping = {}
renamed = 0
skipped = 0

for book in catalog:
    old_fn = book.get('filename')
    if not old_fn:
        continue
    
    old_path = os.path.join(PDFS_LOCAL, old_fn)
    if not os.path.exists(old_path):
        skipped += 1
        continue
    
    # Build new filename
    author = book.get('author', 'Desconocido')
    title = book.get('title', 'Sin titulo')
    year = book.get('year')
    
    new_name = f"{author} - {title}"
    if year:
        new_name += f" ({year})"
    new_name = clean_name(new_name) + '.pdf'
    
    # Ensure unique
    dest = os.path.join(NEW_FLAT, new_name)
    if os.path.exists(dest):
        base = new_name[:-4]
        i = 2
        while os.path.exists(dest):
            dest = os.path.join(NEW_FLAT, f"{base} ({i}).pdf")
            i += 1
        new_name = os.path.basename(dest)
    
    shutil.move(old_path, dest)
    mapping[old_fn] = new_name
    renamed += 1

print(f'Catalogados renombrados: {renamed}')
print(f'No encontrados en disco: {skipped}')

# Move ref/ files (human-readable names, just clean them)
ref_dir = os.path.join(PDFS_LOCAL, 'ref')
if os.path.exists(ref_dir):
    for fn in os.listdir(ref_dir):
        old_path = os.path.join(ref_dir, fn)
        if not os.path.isfile(old_path):
            continue
        # Clean name but keep it recognizable
        new_name = clean_name(fn)
        dest = os.path.join(NEW_FLAT, new_name)
        if os.path.exists(dest):
            base = new_name[:-4]
            i = 2
            while os.path.exists(dest):
                dest = os.path.join(NEW_FLAT, f"{base} ({i}).pdf")
                i += 1
            new_name = os.path.basename(dest)
        shutil.move(old_path, dest)
        mapping[f'ref/{fn}'] = new_name
        renamed += 1

# Move other/ files
other_dir = os.path.join(PDFS_LOCAL, 'otros')
if os.path.exists(other_dir):
    for fn in os.listdir(other_dir):
        old_path = os.path.join(other_dir, fn)
        if not os.path.isfile(old_path):
            continue
        new_name = clean_name(fn)
        dest = os.path.join(NEW_FLAT, new_name)
        if os.path.exists(dest):
            base = new_name[:-4]
            i = 2
            while os.path.exists(dest):
                dest = os.path.join(NEW_FLAT, f"{base} ({i}).pdf")
                i += 1
            new_name = os.path.basename(dest)
        shutil.move(old_path, dest)
        mapping[f'otros/{fn}'] = new_name
        renamed += 1

print(f'Total renombrados: {renamed}')

# Clean up old directories
for d in ['anarquismo', 'otros', 'ref']:
    p = os.path.join(PDFS_LOCAL, d)
    if os.path.exists(p):
        shutil.rmtree(p)
        print(f'Eliminado: {d}/')

# Copy new collection from ZIP extraction
print(f'\nCopiando nuevos PDFs desde ZIPs...')
copied = 0
if os.path.exists(ZIP_PDFS):
    for author_dir in os.listdir(ZIP_PDFS):
        author_path = os.path.join(ZIP_PDFS, author_dir)
        if not os.path.isdir(author_path):
            continue
        for fn in os.listdir(author_path):
            if not fn.lower().endswith('.pdf'):
                continue
            src = os.path.join(author_path, fn)
            # Build name: Author - Title (Year).pdf from filename
            name_no_ext = fn[:-4] if fn.lower().endswith('.pdf') else fn
            # Try to parse "Autor - Título [Año, Editorial]" pattern
            dash_match = re.match(r'^(.+?)\s*[-–—]\s*(.+)$', name_no_ext)
            if dash_match:
                author_part = dash_match[1].strip()
                title_part = dash_match[2].strip()
            else:
                author_part = author_dir.split(',')[0].strip()
                title_part = name_no_ext
            
            # Extract year
            year_match = re.search(r'\[(?:.*?,\s*)?(\d{4})\]', title_part)
            year = int(year_match.group(1)) if year_match else None
            # Clean title
            title_clean = re.sub(r'\s*\[.*?\]\s*', '', title_part).strip()
            
            new_name = f"{author_part} - {title_clean}"
            if year:
                new_name += f" ({year})"
            new_name = clean_name(new_name) + '.pdf'
            
            dest = os.path.join(NEW_FLAT, new_name)
            if os.path.exists(dest):
                base = new_name[:-4]
                i = 2
                while os.path.exists(dest):
                    dest = os.path.join(NEW_FLAT, f"{base} ({i}).pdf")
                    i += 1
                new_name = os.path.basename(dest)
            
            shutil.copy2(src, dest)
            copied += 1

print(f'Nuevos copiados: {copied}')

# Save mapping for Phase 4
with open(MAPPING_FILE, 'w') as f:
    json.dump(mapping, f, indent=2, ensure_ascii=False)

# Final count
total = len(os.listdir(NEW_FLAT))
print(f'\n=== FASE 3 COMPLETA ===')
print(f'Total en pdfs/: {total}')
print(f'Mapping guardado: {MAPPING_FILE}')
