import { useState } from 'react';
import { jsonToCsv } from '../utils/json-utils';

export default function JsonToCsv() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      const csv = jsonToCsv(input);
      if (!csv) {
        setError('No data to convert. Provide an array of objects.');
        setOutput('');
      } else {
        setOutput(csv);
        setError('');
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste JSON array, e.g. [{"name":"Alice","age":25},{"name":"Bob","age":30}]'
        className="w-full h-48 bg-gray-800 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Convert to CSV
        </button>
        {output && (
          <>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Download .csv
            </button>
          </>
        )}
      </div>
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm font-mono">
          {error}
        </div>
      )}
      {output && (
        <pre className="w-full bg-gray-800 text-cyan-400 font-mono text-sm p-4 rounded-lg border border-gray-700 overflow-auto max-h-96">
          {output}
        </pre>
      )}
    </div>
  );
}
