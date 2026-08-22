import { useState } from 'react';
import { parseToTree, TreeNode } from '../utils/json-utils';

function TreeNodeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  const typeColors: Record<string, string> = {
    string: 'text-green-400',
    number: 'text-yellow-400',
    boolean: 'text-purple-400',
    null: 'text-gray-500',
    object: 'text-blue-400',
    array: 'text-cyan-400',
  };

  return (
    <div style={{ marginLeft: depth * 16 }}>
      {/* Only a node with children toggles, so only that row has to be big
          enough to tap; leaf rows stay as dense as they were. */}
      <div
        className={`flex items-center gap-1 py-0.5 hover:bg-gray-800/50 rounded ${
          hasChildren ? 'cursor-pointer min-h-11 md:min-h-0' : ''
        }`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          <span className="text-gray-500 w-4 text-center text-xs">
            {expanded ? '\u25BC' : '\u25B6'}
          </span>
        ) : (
          <span className="w-4" />
        )}
        <span className="text-gray-300 font-medium">{node.key}</span>
        <span className="text-gray-600 mx-1">:</span>
        {hasChildren ? (
          <span className={`text-xs ${typeColors[node.type]}`}>
            {node.type === 'array'
              ? `Array(${node.children!.length})`
              : `Object{${node.children!.length}}`}
          </span>
        ) : (
          <span className={`text-sm ${typeColors[node.type]}`}>
            {node.type === 'string' ? `"${node.value}"` : String(node.value)}
          </span>
        )}
      </div>
      {expanded &&
        hasChildren &&
        node.children!.map((child, i) => (
          <TreeNodeItem key={`${child.key}-${i}`} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export default function TreeView() {
  const [input, setInput] = useState('');
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [error, setError] = useState('');

  const handleParse = () => {
    try {
      setTree(parseToTree(input));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setTree(null);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON to visualize as a tree..."
        className="w-full h-48 bg-gray-800 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
      />
      <button
        onClick={handleParse}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        Build Tree
      </button>
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm font-mono">
          {error}
        </div>
      )}
      {tree && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 font-mono text-sm overflow-auto max-h-[500px]">
          <TreeNodeItem node={tree} />
        </div>
      )}
    </div>
  );
}
