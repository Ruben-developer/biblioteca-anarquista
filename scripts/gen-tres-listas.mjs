import { readFileSync, writeFileSync } from "node:fs";

const SRC = "/home/fdr/.local/share/opencode/tool-output/tool_04efb10ee001FJ4CWP5zjMGAPN";
const OUT = "/home/fdr/biblioteca-anarquista/data/registros/revision330";

const text = readFileSync(SRC, "utf8");
const lines = text.split("\n");

const headers = [
  { key: "historia", re: /^### Lista 1: Historia/i },
  { key: "teoria", re: /^### Lista 2: Teoría/i },
  { key: "otros", re: /^### Lista 3: Otros/i },
];

const idx = headers.map((h) => {
  const i = lines.findIndex((l) => h.re.test(l));
  return { key: h.key, i };
});

const sections = {};
for (let n = 0; n < idx.length; n++) {
  const start = idx[n].i + 1;
  const end = n + 1 < idx.length ? idx[n + 1].i : lines.length;
  const body = lines.slice(start, end).filter((l) => l.trim().startsWith("- "));
  sections[idx[n].key] = body;
}

const titles = { historia: "Historia", teoria: "Teoría", otros: "Otros" };
for (const key of Object.keys(sections)) {
  const body = sections[key];
  const md = `# Textos — ${titles[key]} (clasificación del catálogo)\n\nTotal en este archivo: ${body.length}\n\n${body.join("\n")}\n`;
  writeFileSync(`${OUT}/${key}.md`, md);
  console.log(`${key}.md -> ${body.length} entradas`);
}
