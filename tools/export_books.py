#!/usr/bin/env python3
"""
Export/import de notas para La Idea.
Formato mínimo: id, title, author, notes.

Uso:
  python3 tools/export_books.py export > books.json
  python3 tools/export_books.py import books.json
  python3 tools/export_books.py import books.json --dry-run
"""

import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REGION_DATA = Path(__file__).parent.parent / 'src' / 'data' / 'regionData.js'


def make_id(title, author):
    raw = f'{title.strip().lower()}|{author.strip().lower()}'
    return hashlib.sha256(raw.encode()).hexdigest()[:12]


def make_note_id():
    import random
    return 'n' + ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=8))


def parse_region_data():
    """Extrae libros de regionData.js."""
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

        # Parse notes
        notes = []
        notes_m = re.search(r'notes:\s*\[(.*?)\]', line)
        if notes_m:
            for nm in re.finditer(r'\{[^}]+\}', notes_m.group(0)):
                note_str = nm.group(0)
                nid_m = re.search(r'id:\s*["\'](.+?)["\']', note_str)
                text_m = re.search(r'text:\s*["\'](.+?)["\']', note_str)
                ts_m = re.search(r'ts:\s*["\'](.+?)["\']', note_str)
                if nid_m and text_m:
                    notes.append({
                        'id': nid_m.group(1),
                        'text': text_m.group(1),
                        'ts': ts_m.group(1) if ts_m else '',
                    })

        books.append({
            'id': make_id(title, author),
            'title': title,
            'author': author,
            'notes': notes,
        })

    return books


def export_books():
    books = parse_region_data()
    print(json.dumps(books, indent=2, ensure_ascii=False))


def import_books(filepath, dry_run=False):
    with open(filepath) as f:
        incoming = json.load(f)

    content = REGION_DATA.read_text()
    existing = parse_region_data()
    existing_ids = {b['id'] for b in existing}

    updated = 0
    errors = []

    for book in incoming:
        bid = book.get('id', '')
        title = book.get('title', '').strip()
        author = book.get('author', 'Varios Autores').strip()
        notes = book.get('notes', [])

        if not title:
            errors.append(f'Sin título: {book}')
            continue

        if not bid:
            bid = make_id(title, author)

        if bid not in existing_ids:
            errors.append(f'No existe: {title} ({bid})')
            continue

        # Buscar línea del libro
        pattern = re.compile(
            r'(\{\s*title:\s*["\']' + re.escape(title) + r'["\']'
            r'.*?)(\})',
            re.DOTALL
        )
        match = pattern.search(content)
        if not match:
            continue

        line = match.group(1)

        if notes:
            existing_notes_m = re.search(r'notes:\s*\[(.*?)\]', line)
            existing_note_ids = set()
            if existing_notes_m:
                for nm in re.finditer(r'id:\s*["\'](.+?)["\']', existing_notes_m.group(1)):
                    existing_note_ids.add(nm.group(1))

            new_notes = []
            for n in notes:
                if n.get('id') not in existing_note_ids:
                    nid = n.get('id') or make_note_id()
                    text = n.get('text', '')
                    ts = n.get('ts', datetime.now(timezone.utc).isoformat())
                    new_notes.append(f'{{id: "{nid}", text: "{text}", ts: "{ts}"}}')

            if new_notes:
                notes_str = ', '.join(new_notes)
                if 'notes:' in line:
                    line = re.sub(
                        r'notes:\s*\[([^\]]*)\]',
                        lambda m: f'notes: [{m.group(1).rstrip()}, {notes_str}]' if m.group(1).strip() else f'notes: [{notes_str}]',
                        line
                    )
                else:
                    line = line.rstrip() + f', notes: [{notes_str}]'
                content = content[:match.start()] + line + match.group(2) + content[match.end():]
                updated += 1
        else:
            updated += 1

    if not dry_run and updated > 0:
        REGION_DATA.write_text(content)

    print(f'Actualizados: {updated} | Errores: {len(errors)}')
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
