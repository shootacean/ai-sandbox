import { assertEquals, assertThrows } from '@std/assert';
import { parseArgs, validateArgs, getExamples } from '../../src/cli/parser.ts';

Deno.test('CLI argument parsing', async (t) => {
  await t.step('should parse empty arguments', () => {
    const args = parseArgs([]);
    assertEquals(args, {});
  });

  await t.step('should parse help flags', () => {
    assertEquals(parseArgs(['-h']).help, true);
    assertEquals(parseArgs(['--help']).help, true);
  });

  await t.step('should parse version flags', () => {
    assertEquals(parseArgs(['-v']).version, true);
    assertEquals(parseArgs(['--version']).version, true);
  });

  await t.step('should parse start and end', () => {
    const args1 = parseArgs(['-s', '10', '-e', '20']);
    assertEquals(args1.start, 10);
    assertEquals(args1.end, 20);

    const args2 = parseArgs(['--start', '1', '--end', '100']);
    assertEquals(args2.start, 1);
    assertEquals(args2.end, 100);
  });

  await t.step('should parse format', () => {
    const args1 = parseArgs(['-f', 'json']);
    assertEquals(args1.format, 'json');

    const args2 = parseArgs(['--format', 'csv']);
    assertEquals(args2.format, 'csv');
  });

  await t.step('should parse rules', () => {
    const args = parseArgs(['-r', '7:Lucky', '--rule', '11:Eleven']);
    assertEquals(args.rules, ['7:Lucky', '11:Eleven']);
  });

  await t.step('should parse key=value format', () => {
    const args = parseArgs(['--start=5', '--end=15', '--format=table']);
    assertEquals(args.start, 5);
    assertEquals(args.end, 15);
    assertEquals(args.format, 'table');
  });

  await t.step('should parse positional arguments', () => {
    const args = parseArgs(['10', '20']);
    assertEquals(args.start, 10);
    assertEquals(args.end, 20);
  });

  await t.step('should mix positional and named arguments', () => {
    const args = parseArgs(['5', '15', '--format', 'json']);
    assertEquals(args.start, 5);
    assertEquals(args.end, 15);
    assertEquals(args.format, 'json');
  });

  await t.step('should throw on invalid arguments', () => {
    assertThrows(() => parseArgs(['--unknown']));
    assertThrows(() => parseArgs(['--start'])); // Missing value
    assertThrows(() => parseArgs(['--start', 'abc'])); // Invalid number
    assertThrows(() => parseArgs(['1', '2', '3'])); // Too many positional
  });
});

Deno.test('CLI argument validation', async (t) => {
  await t.step('should set defaults', () => {
    const args = {};
    validateArgs(args);
    assertEquals(args.start, 1);
    assertEquals(args.end, 100);
    assertEquals(args.format, 'numbered');
  });

  await t.step('should validate range', () => {
    assertThrows(
      () => validateArgs({ start: 10, end: 5 }),
      Error,
      'Start must be less than or equal to end'
    );
  });

  await t.step('should validate format', () => {
    assertThrows(
      () => validateArgs({ format: 'unknown' }),
      Error,
      'Unsupported format'
    );
  });

  await t.step('should validate rules', () => {
    assertThrows(
      () => validateArgs({ rules: ['invalid'] }),
      Error,
      'Invalid rule format'
    );

    assertThrows(
      () => validateArgs({ rules: ['abc:Test'] }),
      Error,
      'Invalid divisor'
    );

    assertThrows(
      () => validateArgs({ rules: ['0:Zero'] }),
      Error,
      'Invalid divisor'
    );
  });
});

Deno.test('CLI examples', async (t) => {
  await t.step('should provide examples', () => {
    const examples = getExamples();
    assertEquals(examples.length > 0, true);
    assertEquals(examples.includes('fizzbuzz'), true);
    assertEquals(examples.includes('fizzbuzz 1 50'), true);
  });
});