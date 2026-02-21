export interface ValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

export function formatJson(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

export function validateJson(input: string): ValidationResult {
  if (!input.trim()) {
    return { valid: false, error: 'Input is empty' };
  }
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const error = e as SyntaxError;
    const message = error.message;
    // Try to extract position info from error message
    const posMatch = message.match(/position\s+(\d+)/i);
    let line = undefined;
    let column = undefined;
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = input.substring(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
    return { valid: false, error: message, line, column };
  }
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function jsonToCsv(input: string): string {
  const parsed = JSON.parse(input);
  const arr = Array.isArray(parsed) ? parsed : [parsed];

  if (arr.length === 0) return '';

  // Collect all keys (flatten one level)
  const allKeys = new Set<string>();
  for (const item of arr) {
    if (typeof item === 'object' && item !== null) {
      for (const key of Object.keys(item)) {
        allKeys.add(key);
      }
    }
  }

  const keys = Array.from(allKeys);
  if (keys.length === 0) return '';

  const escapeCsvValue = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = keys.map(escapeCsvValue).join(',');
  const rows = arr.map(item => {
    return keys.map(key => {
      const val = typeof item === 'object' && item !== null ? item[key] : '';
      return escapeCsvValue(val);
    }).join(',');
  });

  return [header, ...rows].join('\n');
}

export interface TreeNode {
  key: string;
  value: unknown;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  children?: TreeNode[];
}

export function parseToTree(input: string): TreeNode {
  const parsed = JSON.parse(input);
  return buildTree('root', parsed);
}

function buildTree(key: string, value: unknown): TreeNode {
  if (value === null) {
    return { key, value, type: 'null' };
  }
  if (Array.isArray(value)) {
    return {
      key,
      value,
      type: 'array',
      children: value.map((item, index) => buildTree(`[${index}]`, item)),
    };
  }
  if (typeof value === 'object') {
    return {
      key,
      value,
      type: 'object',
      children: Object.entries(value as Record<string, unknown>).map(([k, v]) =>
        buildTree(k, v)
      ),
    };
  }
  return {
    key,
    value,
    type: typeof value as 'string' | 'number' | 'boolean',
  };
}
