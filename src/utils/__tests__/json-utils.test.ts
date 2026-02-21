import { describe, it, expect } from 'vitest';
import {
  formatJson,
  validateJson,
  minifyJson,
  jsonToCsv,
  parseToTree,
} from '../json-utils';

describe('formatJson', () => {
  it('should format compact JSON with indentation', () => {
    const input = '{"name":"John","age":30}';
    const result = formatJson(input);
    expect(result).toBe('{\n  "name": "John",\n  "age": 30\n}');
  });

  it('should handle arrays', () => {
    const input = '[1,2,3]';
    const result = formatJson(input);
    expect(result).toContain('[\n');
    expect(result).toContain('  1');
  });

  it('should throw on invalid JSON', () => {
    expect(() => formatJson('not json')).toThrow();
  });
});

describe('validateJson', () => {
  it('should return valid for correct JSON', () => {
    const result = validateJson('{"key": "value"}');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return invalid with error for bad JSON', () => {
    const result = validateJson('{key: "value"}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return invalid for empty input', () => {
    const result = validateJson('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Input is empty');
  });

  it('should return invalid for whitespace-only input', () => {
    const result = validateJson('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Input is empty');
  });
});

describe('minifyJson', () => {
  it('should remove whitespace from formatted JSON', () => {
    const input = '{\n  "name": "John",\n  "age": 30\n}';
    const result = minifyJson(input);
    expect(result).toBe('{"name":"John","age":30}');
  });

  it('should handle already minified JSON', () => {
    const input = '{"a":1}';
    expect(minifyJson(input)).toBe('{"a":1}');
  });
});

describe('jsonToCsv', () => {
  it('should convert array of objects to CSV', () => {
    const input = '[{"name":"Alice","age":25},{"name":"Bob","age":30}]';
    const result = jsonToCsv(input);
    const lines = result.split('\n');
    expect(lines[0]).toBe('name,age');
    expect(lines[1]).toBe('Alice,25');
    expect(lines[2]).toBe('Bob,30');
  });

  it('should handle single object (not array)', () => {
    const input = '{"name":"Alice","age":25}';
    const result = jsonToCsv(input);
    const lines = result.split('\n');
    expect(lines[0]).toBe('name,age');
    expect(lines[1]).toBe('Alice,25');
  });

  it('should handle nested objects by stringifying them', () => {
    const input = '[{"name":"Alice","address":{"city":"NYC"}}]';
    const result = jsonToCsv(input);
    expect(result).toContain('name,address');
    expect(result).toContain('Alice');
  });

  it('should return empty string for empty array', () => {
    expect(jsonToCsv('[]')).toBe('');
  });

  it('should escape CSV values with commas', () => {
    const input = '[{"name":"Doe, John","age":30}]';
    const result = jsonToCsv(input);
    expect(result).toContain('"Doe, John"');
  });
});

describe('parseToTree', () => {
  it('should parse object into tree structure', () => {
    const input = '{"name":"John","age":30}';
    const tree = parseToTree(input);
    expect(tree.type).toBe('object');
    expect(tree.children).toHaveLength(2);
    expect(tree.children![0].key).toBe('name');
    expect(tree.children![0].type).toBe('string');
    expect(tree.children![1].key).toBe('age');
    expect(tree.children![1].type).toBe('number');
  });

  it('should parse arrays into tree with indexed keys', () => {
    const input = '[1, "two", null]';
    const tree = parseToTree(input);
    expect(tree.type).toBe('array');
    expect(tree.children).toHaveLength(3);
    expect(tree.children![0].key).toBe('[0]');
    expect(tree.children![1].key).toBe('[1]');
    expect(tree.children![2].type).toBe('null');
  });

  it('should handle nested objects', () => {
    const input = '{"user":{"name":"Alice","tags":["a","b"]}}';
    const tree = parseToTree(input);
    expect(tree.type).toBe('object');
    const userNode = tree.children![0];
    expect(userNode.type).toBe('object');
    expect(userNode.children).toHaveLength(2);
    const tagsNode = userNode.children![1];
    expect(tagsNode.type).toBe('array');
    expect(tagsNode.children).toHaveLength(2);
  });
});
