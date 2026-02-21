import { useState } from 'react';
import { validateJson } from '../utils/json-utils';

export default function JsonValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; error?: string; line?: number; column?: number } | null>(null);

  const handleValidate = () => {
    setResult(validateJson(input));
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON to validate..."
        className="w-full h-48 bg-gray-800 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
      />
      <button
        onClick={handleValidate}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        Validate
      </button>
      {result && (
        <div
          className={`p-4 rounded-lg border ${
            result.valid
              ? 'bg-green-900/50 border-green-700 text-green-300'
              : 'bg-red-900/50 border-red-700 text-red-300'
          }`}
        >
          {result.valid ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl">&#10003;</span>
              <span className="font-medium">Valid JSON</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">&#10007;</span>
                <span className="font-medium">Invalid JSON</span>
              </div>
              <p className="font-mono text-sm">{result.error}</p>
              {result.line && (
                <p className="text-sm">
                  Line {result.line}, Column {result.column}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
