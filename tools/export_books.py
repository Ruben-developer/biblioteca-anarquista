#!/usr/bin/env python3
"""
Export/import de libros para La Idea.
Formato mínimo: title, author, year, category, filename.

Uso:
  python3 tools/export_books.py export > books.json
  python3 tools/export_books.py import books.json
  python3 tools/export_books.py import books.json --dry-run
"""

import json
import re
import sys
from pathlib import Path

REGION_DATA = Path(__file__).parent.parent / 'src' / 'data' / 'regionData.js'

CATEGORIES = {'historia', 'teoria', 'acratas', 'otros'}


def parse_region_data():
    """Extrae todos los libros de regionData.js."""
    content = REGION_DATA.read_text()
    books = []

    # Encuentra cada libro: { title: '...', author: '...', ... }
    book_pattern = re.compile(
        r'\{\s*title:\s*["\'](.+?)["\']'
        r'(?:,\s*author:\s*["\'](.+?)["\'])?'
        r'(?:,\s*year:\s*(\d{4}))?'
        r'(?:,\s*category:\s*["\'](\w+)["\'])?'
        r'(?:,\s*(?:[^}])*?filename:\s*["\'](.+?)["\'])?'
        , re.DOTALL
    )

    # Extract regions
    region_pattern = re.compile(r'"([^"]+)":\s*\{\s*iso:')
    regions = {}
    current_region = None

    for line in content.split('\n'):
        region_match = re.search(r'"([^"]+)":\s*\{', line)
        if region_match and 'iso:' in line:
            current_region = region_match.group(1)
        elif region_match and 'books:' in line:
            current_region = region_match.group(1)

        book_match = book_pattern.search(line)
        if book_match:
            title = book_match.group(1)
            author = book_match.group(2) or 'Varios Autores'
            year = int(book_match.group(3)) if book_match.group(3) else None
            category = book_match.group(4) or 'otros'
            filename = book_match.group(5) or ''

            books.append({
                'title': title,
                'author': author,
                'year': year,
                'category': category,
                'filename': filename,
            })

    return books


def export_books():
    """Exporta libros en formato mínimo."""
    books = parse_region_data()
    # Simplificar: solo campos esenciales
    minimal = []
    for b in books:
        entry = {
            'title': b['title'],
            'author': b['author'],
            'category': b['category'],
        }
        if b['year']:
            entry['year'] = b['year']
        if b['filename']:
            entry['filename'] = b['filename']
        minimal.append(entry)

    print(json.dumps(minimal, indent=2, ensure_ascii=False))


def import_books(filepath, dry_run=False):
    """Importa libros desde JSON mínimo."""
    with open(filepath) as f:
        books = json.load(f)

    content = REGION_DATA.read_text()

    imported = 0
    skipped = 0
    errors = []

    for book in books:
        title = book.get('title', '').strip()
        author = book.get('author', 'Varios Autores').strip()
        year = book.get('year')
        category = book.get('category', 'otros').strip()
        filename = book.get('filename', '').strip()

        if not title:
            errors.append(f'Sin título: {book}')
            continue

        if category not in CATEGORIES:
            errors.append(f'Categoría inválida "{category}": {title}')
            continue

        # Verificar si ya existe
        if title in content:
            skipped += 1
            continue

        # Construir línea del libro
        fields = [f'title: "{title}"', f'author: "{author}"']
        if year:
            fields.append(f'year: {year}')
        fields.append(f'category: "{category}"')
        if filename:
            fields.append(f'filename: "{filename}"')

        book_line = '      { ' + ', '.join(fields) + ' },'

        if dry_run:
            print(f'  [DRY] {book_line}')
            imported += 1
            continue

        # Insertar antes del cierre de la región más reciente
        # Buscar el último '],\n' o ']\n' en el archivo
        insert_pos = content.rfind('],')
        if insert_pos == -1:
            insert_pos = content.rfind(']\n')
        if insert_pos == -1:
            errors.append(f'No se pudo encontrar punto de inserción: {title}')
            continue

        content = content[:insert_pos] + book_line + '\n    ' + content[insert_pos:]
        imported += 1

    if not dry_run and imported > 0:
        REGION_DATA.write_text(content)

    print(f'Importados: {imported} | Saltados (duplicados): {skipped} | Errores: {len(errors)}')
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
