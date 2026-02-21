import { useState } from 'react';
import { minifyJson } from '../utils/json-utils';

export default function JsonMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleMinify = () => {
    try {
      setOutput(minifyJson(input));
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
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste formatted JSON to minify..."
        className="w-full h-48 bg-gray-800 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleMinify}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Minify
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
        <div className="relative">
          <pre className="w-full bg-gray-800 text-yellow-400 font-mono text-sm p-4 rounded-lg border border-gray-700 overflow-auto break-all whitespace-pre-wrap">
            {output}
          </pre>
          <div className="mt-2 text-xs text-gray-500">
            {input.length} chars → {output.length} chars (saved {input.length - output.length} chars)
          </div>
        </div>
      )}
    </div>
  );
}
