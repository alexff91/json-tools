import { useMemo, useState } from 'react';
import { formatJson, minifyJson, jsonToCsv, parseToTree, validateJson, TreeNode } from './utils/json-utils';

// One paste, five answers. The old page had a tab per tool and an empty box in
// each, so the same JSON had to be pasted again for every question. Now the
// text is kept once, checked as you type, and the tabs only change the view.
const EXAMPLE = `{
  "order": 1042,
  "paid": true,
  "customer": { "name": "Ann Weber", "city": "Esch-sur-Alzette" },
  "items": [
    { "sku": "LUX-01", "qty": 2, "price": 4.5 },
    { "sku": "LUX-07", "qty": 1, "price": 12 }
  ],
  "note": null
}`;

const MODES = [
  { id: 'pretty', label: 'Pretty' },
  { id: 'tree', label: 'Tree' },
  { id: 'minify', label: 'Minify' },
  { id: 'csv', label: 'CSV' },
] as const;
type Mode = (typeof MODES)[number]['id'];

const TYPE_COLOUR: Record<string, string> = {
  string: '#0f6b43', number: '#1d4f91', boolean: '#7a2e8f', null: '#6f7f8d', object: '#0b1622', array: '#0b1622',
};

function Node({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const kids = node.children && node.children.length > 0;
  return (
    <div style={{ marginLeft: depth ? 16 : 0, borderLeft: depth ? '1px solid var(--line)' : 0, paddingLeft: depth ? 10 : 0 }}>
      <div onClick={() => kids && setOpen(!open)}
        style={{ display: 'flex', gap: 6, alignItems: 'baseline', cursor: kids ? 'pointer' : 'default', minHeight: kids ? 34 : 24, padding: '2px 0' }}>
        <span style={{ width: 12, color: 'var(--dim)', fontSize: 10 }}>{kids ? (open ? '▼' : '▶') : ''}</span>
        <span style={{ fontWeight: 500 }}>{node.key}</span>
        <span style={{ color: 'var(--dim)' }}>:</span>
        {kids
          ? <span style={{ color: 'var(--soft)', fontSize: 12 }}>{node.type === 'array' ? `array · ${node.children!.length}` : `object · ${node.children!.length}`}</span>
          : <span style={{ color: TYPE_COLOUR[node.type], wordBreak: 'break-word' }}>{node.type === 'string' ? `"${node.value}"` : String(node.value)}</span>}
      </div>
      {open && kids && node.children!.map((c, i) => <Node key={`${c.key}-${i}`} node={c} depth={depth + 1} />)}
    </div>
  );
}

function App() {
  const [input, setInput] = useState(EXAMPLE);
  const [mode, setMode] = useState<Mode>('pretty');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const isExample = input === EXAMPLE;

  const check = useMemo(() => (input.trim() ? validateJson(input) : null), [input]);
  const ok = !!check?.valid;

  const out = useMemo(() => {
    if (!ok) return { text: '', tree: null as TreeNode | null, error: '' };
    try {
      if (mode === 'pretty') return { text: formatJson(input, indent), tree: null, error: '' };
      if (mode === 'minify') return { text: minifyJson(input), tree: null, error: '' };
      if (mode === 'csv') {
        const csv = jsonToCsv(input);
        return { text: csv, tree: null, error: csv ? '' : 'CSV needs an array of objects — for example [{"name":"Ann"},{"name":"Bob"}].' };
      }
      return { text: '', tree: parseToTree(input), error: '' };
    } catch (e) {
      return { text: '', tree: null, error: (e as Error).message };
    }
  }, [input, mode, indent, ok]);

  const copy = () => {
    navigator.clipboard.writeText(out.text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); });
  };
  const download = () => {
    const ext = mode === 'csv' ? 'csv' : 'json';
    const url = URL.createObjectURL(new Blob([out.text], { type: mode === 'csv' ? 'text/csv' : 'application/json' }));
    (window as unknown as { markToolUsed?: () => void }).markToolUsed?.();
    const a = document.createElement('a'); a.href = url; a.download = `data.${ext}`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="wb">
      <header className="wb-top">
        <a className="wb-brand" href="https://alftech.space/"><i />ALFTECH</a>
        <nav><a href="https://regex.alftech.space/">regex</a><a href="https://cron.alftech.space/">cron</a></nav>
      </header>
      <main className="wb-main">
        <div className="wb-eyebrow">JSON tools · runs in your browser</div>
        <h1 className="wb-h1">Paste it once. <em>Read</em> it any way.</h1>
        <p className="wb-lede">Checked as you type — and when it breaks, you get the line and column. Then pretty-print it, walk it as a tree, squeeze it to one line, or turn an array into CSV.</p>

        <div className="wb-grid2">
          <section className="wb-slab" style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="wb-label" htmlFor="json">Your JSON {isExample && <span style={{ color: 'var(--acc)' }}>· example — paste your own</span>}</label>
            <textarea id="json" value={input} onChange={e => setInput(e.target.value)} rows={14} spellCheck={false}
              style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.55, resize: 'vertical', flex: 1 }} placeholder='{"paste": "here"}' />
            <div className="wb-row" style={{ marginTop: 12, justifyContent: 'space-between' }}>
              <span className="wb-mono" style={{ fontSize: 13, color: !check ? '#8ea2b4' : ok ? 'var(--acc)' : '#ff8fa0' }}>
                {!check ? 'waiting for JSON' : ok ? `✓ valid · ${input.length.toLocaleString('en')} characters`
                  : `✗ ${check.error}${check.line ? ` — line ${check.line}, column ${check.column}` : ''}`}
              </span>
              {input && <button className="wb-chip" onClick={() => setInput('')}>clear</button>}
            </div>
          </section>

          <section>
            <div className="wb-row" style={{ marginBottom: 10 }}>
              {MODES.map(m => <button key={m.id} className="wb-chip" style={{ opacity: mode === m.id ? 1 : .6 }} aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</button>)}
              {mode === 'pretty' && (
                <select className="wb-field" style={{ width: 'auto', padding: '8px 10px', marginLeft: 'auto' }} value={indent} onChange={e => setIndent(Number(e.target.value))} aria-label="Indent">
                  <option value={2}>2 spaces</option><option value={4}>4 spaces</option><option value={8}>8 spaces</option>
                </select>
              )}
            </div>
            {!ok && <div className="wb-sheet" style={{ color: 'var(--soft)', minHeight: 200 }}>{check ? 'Fix the error on the left and the result appears here.' : 'Paste JSON on the left.'}</div>}
            {ok && out.error && <div className="wb-note">{out.error}</div>}
            {ok && !out.error && mode === 'tree' && out.tree && (
              <div className="wb-sheet wb-mono" style={{ fontSize: 14, maxHeight: 520, overflow: 'auto' }}><Node node={out.tree} /></div>
            )}
            {ok && !out.error && mode !== 'tree' && (
              <>
                <pre className="wb-sheet wb-mono" style={{ fontSize: 14, margin: 0, maxHeight: 520, overflow: 'auto', whiteSpace: mode === 'minify' ? 'pre-wrap' : 'pre', wordBreak: mode === 'minify' ? 'break-all' : 'normal' }}>{out.text}</pre>
                <div className="wb-row" style={{ marginTop: 10 }}>
                  <button className="wb-btn acc" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
                  <button className="wb-btn ghost" onClick={download}>Download .{mode === 'csv' ? 'csv' : 'json'}</button>
                  {mode === 'minify' && <span className="wb-mono" style={{ fontSize: 12, color: 'var(--soft)' }}>{input.length} → {out.text.length} characters</span>}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
