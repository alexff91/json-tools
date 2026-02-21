import { useState } from 'react';
import JsonFormatter from './components/JsonFormatter';
import JsonValidator from './components/JsonValidator';
import JsonMinifier from './components/JsonMinifier';
import JsonToCsv from './components/JsonToCsv';
import TreeView from './components/TreeView';

const tabs = [
  { id: 'format', label: 'Formatter', icon: '{ }' },
  { id: 'validate', label: 'Validator', icon: '\u2713' },
  { id: 'minify', label: 'Minifier', icon: '\u2190\u2192' },
  { id: 'csv', label: 'JSON \u2192 CSV', icon: '\u2261' },
  { id: 'tree', label: 'Tree View', icon: '\u25E2' },
] as const;

type TabId = (typeof tabs)[number]['id'];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('format');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">
            <span className="text-blue-400">{'{'}</span> JSON Tools{' '}
            <span className="text-blue-400">{'}'}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Swiss Army Knife for JSON</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <nav className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          {activeTab === 'format' && <JsonFormatter />}
          {activeTab === 'validate' && <JsonValidator />}
          {activeTab === 'minify' && <JsonMinifier />}
          {activeTab === 'csv' && <JsonToCsv />}
          {activeTab === 'tree' && <TreeView />}
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12 py-6 text-center text-gray-600 text-sm">
        JSON Tools &mdash; Format, validate, minify, convert, and explore JSON
      </footer>
    </div>
  );
}

export default App;
