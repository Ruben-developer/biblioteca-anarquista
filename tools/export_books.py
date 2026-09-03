#!/usr/bin/env python3
"""
Export/import de libros para La Idea.
ID determinista (sha256 de título+autor) + notas incluidas.

Uso:
  python3 tools/export_books.py export > books.json
  python3 tools/export_books.py import books.json
  python3 tools/export_books.py import books.json --dry-run
"""

import hashlib
import json
import re
import sys
from pathlib import Path

REGION_DATA = Path(__file__).parent.parent / 'src' / 'data' / 'regionData.js'
CATEGORIES = {'historia', 'teoria', 'acratas', 'otros'}


def make_id(title, author):
    """ID determinista: sha256 corto de título+autor."""
    raw = f'{title.strip().lower()}|{author.strip().lower()}'
    return hashlib.sha256(raw.encode()).hexdigest()[:12]


def parse_region_data():
    """Extrae todos los libros de regionData.js con note si existe."""
    content = REGION_DATA.read_text()
    books = []

    for line in content.split('\n'):
        if 'title:' not in line:
            continue

        title_m = re.search(r'title:\s*["\'](.+?)["\']', line)
        if not title_m:
            continue
        title = title_m.group(1)

        author_m = re.search(r'author:\s*["\'](.+?)["\']', line)
        author = author_m.group(1) if author_m else 'Varios Autores'

        year_m = re.search(r'year:\s*(\d{4})', line)
        year = int(year_m.group(1)) if year_m else None

        cat_m = re.search(r'category:\s*["\'](\w+)["\']', line)
        category = cat_m.group(1) if cat_m else 'otros'

        fn_m = re.search(r'filename:\s*["\'](.+?)["\']', line)
        filename = fn_m.group(1) if fn_m else ''

        note_m = re.search(r'note:\s*["\'](.+?)["\']', line)
        note = note_m.group(1) if note_m else ''

        books.append({
            'id': make_id(title, author),
            'title': title,
            'author': author,
            'category': category,
            'year': year,
            'filename': filename,
            'note': note,
        })

    return books


def export_books():
    """Exporta libros con ID y note."""
    books = parse_region_data()
    print(json.dumps(books, indent=2, ensure_ascii=False))


def import_books(filepath, dry_run=False):
    """Importa libros. Por ID: actualiza si existe, inserta si no."""
    with open(filepath) as f:
        incoming = json.load(f)

    content = REGION_DATA.read_text()
    existing = parse_region_data()
    existing_ids = {b['id'] for b in existing}

    imported = 0
    updated = 0
    skipped = 0
    errors = []

    for book in incoming:
        bid = book.get('id', '')
        title = book.get('title', '').strip()
        author = book.get('author', 'Varios Autores').strip()
        year = book.get('year')
        category = book.get('category', 'otros').strip()
        filename = book.get('filename', '').strip()
        note = book.get('note', '').strip()

        if not title:
            errors.append(f'Sin título: {book}')
            continue

        if category not in CATEGORIES:
            errors.append(f'Categoría inválida "{category}": {title}')
            continue

        # Generar ID si no viene
        if not bid:
            bid = make_id(title, author)

        # Si el ID ya existe → actualizar note/filename
        if bid in existing_ids:
            # Buscar la línea original y actualizar campos
            pattern = re.compile(
                r'(\{\s*title:\s*["\']' + re.escape(title) + r'["\']'
                r'.*?)(\})',
                re.DOTALL
            )
            match = pattern.search(content)
            if match:
                line = match.group(1)
                # Actualizar note
                if note:
                    if 'note:' in line:
                        line = re.sub(r'note:\s*["\'].*?["\']', f'note: "{note}"', line)
                    else:
                        line = line.rstrip() + f', note: "{note}"'
                # Actualizar filename
                if filename:
                    if 'filename:' in line:
                        line = re.sub(r'filename:\s*["\'].*?["\']', f'filename: "{filename}"', line)
                    else:
                        line = line.rstrip() + f', filename: "{filename}"'
                content = content[:match.start()] + line + match.group(2) + content[match.end():]
                updated += 1
            continue

        # Construir línea del libro
        fields = [f'title: "{title}"', f'author: "{author}"']
        if year:
            fields.append(f'year: {year}')
        fields.append(f'category: "{category}"')
        if filename:
            fields.append(f'filename: "{filename}"')
        if note:
            fields.append(f'note: "{note}"')

        book_line = '      { ' + ', '.join(fields) + ' },'

        if dry_run:
            print(f'  [DRY] {book_line}')
            imported += 1
            continue

        # Insertar al final del último array de books
        insert_pos = content.rfind('],')
        if insert_pos == -1:
            insert_pos = content.rfind(']\n')
        if insert_pos == -1:
            errors.append(f'Sin punto de inserción: {title}')
            continue

        content = content[:insert_pos] + book_line + '\n    ' + content[insert_pos:]
        existing_ids.add(bid)
        imported += 1

    if not dry_run and (imported > 0 or updated > 0):
        REGION_DATA.write_text(content)

    print(f'Importados: {imported} | Actualizados: {updated} | Errores: {len(errors)}')
    for e in errors:
        print(f'  ERROR: {e}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == 'export':
        export_books()
    elif cmd == 'import':
        if len(sys.argv) < 3:
            print('Uso: import <archivo.json> [--dry-run]')
            sys.exit(1)
        dry_run = '--dry-run' in sys.argv
        import_books(sys.argv[2], dry_run)
    else:
        print(f'Comando desconocido: {cmd}')
        print(__doc__)
        sys.exit(1)
