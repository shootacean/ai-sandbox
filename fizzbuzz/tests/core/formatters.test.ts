import { assertEquals, assertThrows } from '@std/assert';
import {
  PlainFormatter,
  NumberedFormatter,
  JsonFormatter,
  CsvFormatter,
  TableFormatter,
  CompactFormatter,
  createFormatter,
  getSupportedFormats,
  formatResults,
  formatResult
} from '../../src/core/formatters.ts';
import { InvalidFormatError } from '../../src/types/index.ts';
import type { FizzBuzzResult } from '../../src/types/index.ts';

// Helper to create test results
function createTestResults(): FizzBuzzResult[] {
  return [
    {
      number: 1,
      value: '1',
      matchedRules: []
    },
    {
      number: 3,
      value: 'Fizz',
      matchedRules: [{ divisor: 3, replacement: 'Fizz' }]
    },
    {
      number: 5,
      value: 'Buzz',
      matchedRules: [{ divisor: 5, replacement: 'Buzz' }]
    },
    {
      number: 15,
      value: 'FizzBuzz',
      matchedRules: [{ divisor: 15, replacement: 'FizzBuzz' }]
    }
  ];
}

Deno.test('PlainFormatter', async (t) => {
  const formatter = new PlainFormatter();
  const results = createTestResults();

  await t.step('should format single result', () => {
    assertEquals(formatter.formatResult(results[0]), '1');
    assertEquals(formatter.formatResult(results[1]), 'Fizz');
  });

  await t.step('should format with number option', () => {
    assertEquals(
      formatter.formatResult(results[0], { includeNumber: true }),
      '1: 1'
    );
    assertEquals(
      formatter.formatResult(results[1], { includeNumber: true }),
      '3: Fizz'
    );
  });

  await t.step('should format multiple results', () => {
    const output = formatter.formatResults(results);
    const lines = output.split('\n');
    
    assertEquals(lines.length, 4);
    assertEquals(lines[0], '1');
    assertEquals(lines[1], 'Fizz');
    assertEquals(lines[2], 'Buzz');
    assertEquals(lines[3], 'FizzBuzz');
  });
});

Deno.test('NumberedFormatter', async (t) => {
  const formatter = new NumberedFormatter();
  const results = createTestResults();

  await t.step('should always include numbers', () => {
    assertEquals(formatter.formatResult(results[0]), '1: 1');
    assertEquals(formatter.formatResult(results[1]), '3: Fizz');
  });

  await t.step('should format multiple results with numbers', () => {
    const output = formatter.formatResults(results);
    const lines = output.split('\n');
    
    assertEquals(lines.length, 4);
    assertEquals(lines[0], '1: 1');
    assertEquals(lines[1], '3: Fizz');
    assertEquals(lines[2], '5: Buzz');
    assertEquals(lines[3], '15: FizzBuzz');
  });
});

Deno.test('JsonFormatter', async (t) => {
  const formatter = new JsonFormatter();
  const results = createTestResults();

  await t.step('should format single result as JSON', () => {
    const output = formatter.formatResult(results[1]);
    const parsed = JSON.parse(output);
    
    assertEquals(parsed.number, 3);
    assertEquals(parsed.value, 'Fizz');
    assertEquals(parsed.matchedRules.length, 1);
    assertEquals(parsed.matchedRules[0].divisor, 3);
  });

  await t.step('should format with pretty printing', () => {
    const output = formatter.formatResult(results[1], { prettyJson: true });
    
    // Should contain newlines and indentation
    assertEquals(output.includes('\n'), true);
    assertEquals(output.includes('  '), true);
  });

  await t.step('should format multiple results as JSON array', () => {
    const output = formatter.formatResults([results[0], results[1]]);
    const parsed = JSON.parse(output);
    
    assertEquals(Array.isArray(parsed), true);
    assertEquals(parsed.length, 2);
    assertEquals(parsed[0].number, 1);
    assertEquals(parsed[1].number, 3);
  });
});

Deno.test('CsvFormatter', async (t) => {
  const formatter = new CsvFormatter();
  const results = createTestResults();

  await t.step('should format single result as CSV row', () => {
    const output = formatter.formatResult(results[1]);
    assertEquals(output, '3,"Fizz","3:Fizz"');
  });

  await t.step('should use custom separator', () => {
    const output = formatter.formatResult(results[1], { separator: ';' });
    assertEquals(output, '3;"Fizz";"3:Fizz"');
  });

  await t.step('should format multiple results with header', () => {
    const output = formatter.formatResults([results[0], results[1]]);
    const lines = output.split('\n');
    
    assertEquals(lines[0], 'Number,Value,Matched Rules');
    assertEquals(lines[1], '1,"1",""');
    assertEquals(lines[2], '3,"Fizz","3:Fizz"');
  });
});

Deno.test('TableFormatter', async (t) => {
  const formatter = new TableFormatter();
  const results = createTestResults();

  await t.step('should format single result as table row', () => {
    const output = formatter.formatResult(results[1]);
    // Check that it contains the expected parts
    assertEquals(output.includes('3'), true);
    assertEquals(output.includes('Fizz'), true);
    assertEquals(output.includes('3:Fizz'), true);
    assertEquals(output.includes('|'), true);
  });

  await t.step('should format multiple results as table', () => {
    const output = formatter.formatResults([results[0], results[1]]);
    const lines = output.split('\n');
    
    assertEquals(lines[0], '| Number | Value      | Matched Rules        |');
    assertEquals(lines[1], '|--------|------------|----------------------|');
    assertEquals(lines.length, 4); // Header + separator + 2 data rows
  });
});

Deno.test('CompactFormatter', async (t) => {
  const formatter = new CompactFormatter();
  const results = createTestResults();

  await t.step('should format single result as value only', () => {
    assertEquals(formatter.formatResult(results[0]), '1');
    assertEquals(formatter.formatResult(results[1]), 'Fizz');
  });

  await t.step('should format multiple results in single line', () => {
    const output = formatter.formatResults(results);
    assertEquals(output, '1 Fizz Buzz FizzBuzz');
  });

  await t.step('should use custom separator', () => {
    const output = formatter.formatResults(results, { separator: ',' });
    assertEquals(output, '1,Fizz,Buzz,FizzBuzz');
  });
});

Deno.test('Formatter factory and utilities', async (t) => {
  await t.step('should create formatters by name', () => {
    assertEquals(createFormatter('plain') instanceof PlainFormatter, true);
    assertEquals(createFormatter('numbered') instanceof NumberedFormatter, true);
    assertEquals(createFormatter('json') instanceof JsonFormatter, true);
    assertEquals(createFormatter('csv') instanceof CsvFormatter, true);
    assertEquals(createFormatter('table') instanceof TableFormatter, true);
    assertEquals(createFormatter('compact') instanceof CompactFormatter, true);
  });

  await t.step('should throw for unknown format', () => {
    assertThrows(
      () => createFormatter('unknown'),
      InvalidFormatError,
      'Unknown format: unknown'
    );
  });

  await t.step('should provide supported formats list', () => {
    const formats = getSupportedFormats();
    assertEquals(formats.includes('plain'), true);
    assertEquals(formats.includes('numbered'), true);
    assertEquals(formats.includes('json'), true);
    assertEquals(formats.includes('csv'), true);
    assertEquals(formats.includes('table'), true);
    assertEquals(formats.includes('compact'), true);
  });

  await t.step('should format results with utility function', () => {
    const results = createTestResults();
    const output = formatResults(results, 'plain');
    assertEquals(output, '1\nFizz\nBuzz\nFizzBuzz');
  });

  await t.step('should format single result with utility function', () => {
    const result = createTestResults()[1];
    const output = formatResult(result, 'numbered');
    assertEquals(output, '3: Fizz');
  });
});