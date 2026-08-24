#!/usr/bin/env python3
"""Update regionData.js filenames from old paths to new flat structure."""
import json, re

REGION_DATA = '/home/fdr/biblioteca-anarquista/src/data/regionData.js'
MAPPING = '/home/fdr/Documentos/anarquismo_importado/biblioteca-inv/filename_mapping.json'

with open(MAPPING) as f:
    mapping = json.load(f)

# Also add ref/ and otros/ mappings
# Read the actual mapping file content
print(f'Mapping cargado: {len(mapping)} entradas')

with open(REGION_DATA) as f:
    content = f.read()

# Replace each old filename with new
replaced = 0
not_found = 0
for old_fn, new_fn in mapping.items():
    # The old filename appears as a string in regionData.js
    # Pattern: filename: "old_fn"
    old_escaped = old_fn.replace('/', '\\/')
    pattern = f'filename: "{re.escape(old_fn)}"'
    replacement = f'filename: "{new_fn}"'
    if old_fn in content:
        content = content.replace(old_fn, new_fn)
        replaced += 1
    else:
        not_found += 1

with open(REGION_DATA, 'w') as f:
    f.write(content)

print(f'Filenames actualizados: {replaced}')
print(f'No encontrados en regionData.js: {not_found}')

# Verify
with open(REGION_DATA) as f:
    c = f.read()
old_patterns = c.count('anarquismo/f') + c.count('otros/f') + c.count('ref/')
print(f'Patrones viejos restantes: {old_patterns}')
