import { useState } from 'react';
import { formatJson } from '../utils/json-utils';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const handleFormat = () => {
    try {
      setOutput(formatJson(input, indent));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-400">Indent:</label>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={8}>Tab (8)</option>
        </select>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JSON here..."
        className="w-full h-48 bg-gray-800 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Format
        </button>
        {output && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Copy
          </button>
        )}
      </div>
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm font-mono">
          {error}
        </div>
      )}
      {output && (
        <pre className="w-full bg-gray-800 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 overflow-auto max-h-96">
          {output}
        </pre>
      )}
    </div>
  );
}
