import { assertEquals, assertThrows } from '@std/assert';
import { 
  FizzBuzzEngine, 
  createStandardEngine, 
  createCustomEngine, 
  runFizzBuzz 
} from '../../src/core/engine.ts';
import { InvalidRangeError, InvalidRuleError } from '../../src/types/index.ts';

Deno.test('FizzBuzzEngine', async (t) => {
  await t.step('should create engine with standard config', () => {
    const engine = createStandardEngine(1, 15);
    const config = engine.getConfig();
    
    assertEquals(config.start, 1);
    assertEquals(config.end, 15);
    assertEquals(config.rules.length, 3);
  });

  await t.step('should generate correct standard FizzBuzz sequence', () => {
    const engine = createStandardEngine(1, 15);
    const results = engine.generateAll();
    
    assertEquals(results.length, 15);
    assertEquals(results[0].value, '1');
    assertEquals(results[2].value, 'Fizz');
    assertEquals(results[4].value, 'Buzz');
    assertEquals(results[14].value, 'FizzBuzz');
  });

  await t.step('should generate results using iterator', () => {
    const engine = createStandardEngine(13, 17);
    const results = Array.from(engine.generate());
    
    assertEquals(results.length, 5);
    assertEquals(results[0].value, '13');
    assertEquals(results[1].value, '14');
    assertEquals(results[2].value, 'FizzBuzz');
    assertEquals(results[3].value, '16');
    assertEquals(results[4].value, '17');
  });

  await t.step('should evaluate single numbers', () => {
    const engine = createStandardEngine();
    
    assertEquals(engine.evaluateNumber(3).value, 'Fizz');
    assertEquals(engine.evaluateNumber(5).value, 'Buzz');
    assertEquals(engine.evaluateNumber(15).value, 'FizzBuzz');
    assertEquals(engine.evaluateNumber(7).value, '7');
  });

  await t.step('should handle custom ranges', () => {
    const engine = createStandardEngine(1, 100);
    const customResults = Array.from(engine.generateRange(20, 25));
    
    assertEquals(customResults.length, 6);
    assertEquals(customResults[0].value, 'Buzz'); // 20
    assertEquals(customResults[1].value, 'Fizz'); // 21
    assertEquals(customResults[5].value, 'Buzz'); // 25
  });

  await t.step('should provide stats', () => {
    const engine = createStandardEngine(10, 20);
    const stats = engine.getStats();
    
    assertEquals(stats.totalNumbers, 11);
    assertEquals(stats.ruleCount, 3);
    assertEquals(stats.range.start, 10);
    assertEquals(stats.range.end, 20);
  });

  await t.step('should validate configuration', () => {
    assertThrows(
      () => createCustomEngine({
        rules: [],
        start: 1,
        end: 10
      }),
      InvalidRuleError,
      'Rules must be a non-empty array'
    );

    assertThrows(
      () => createCustomEngine({
        rules: [{ divisor: 3, replacement: 'Fizz' }],
        start: 10,
        end: 5
      }),
      InvalidRangeError,
      'Start must be less than or equal to end'
    );

    assertThrows(
      () => createCustomEngine({
        rules: [{ divisor: 3, replacement: 'Fizz' }],
        start: 1,
        end: 1_000_001
      }),
      InvalidRangeError,
      'Range too large'
    );
  });

  await t.step('should handle edge cases', () => {
    const engine = createStandardEngine(0, 0);
    const result = engine.evaluateNumber(0);
    assertEquals(result.value, 'FizzBuzz'); // 0 is divisible by both 3 and 5

    const negativeEngine = createStandardEngine(-5, -1);
    const results = negativeEngine.generateAll();
    assertEquals(results.length, 5);
    assertEquals(results[2].value, 'Fizz'); // -3
  });
});

Deno.test('runFizzBuzz utility function', async (t) => {
  await t.step('should run with default parameters', () => {
    const results = runFizzBuzz();
    assertEquals(results.length, 100);
    assertEquals(results[0].value, '1');
    assertEquals(results[99].value, 'Buzz');
  });

  await t.step('should run with custom range', () => {
    const results = runFizzBuzz(5, 10);
    assertEquals(results.length, 6);
    assertEquals(results[0].value, 'Buzz'); // 5
    assertEquals(results[1].value, 'Fizz'); // 6
  });

  await t.step('should run with custom rules', () => {
    const customRules = [
      { divisor: 7, replacement: 'Lucky' },
      { divisor: 11, replacement: 'Eleven' },
    ];
    const results = runFizzBuzz(7, 14, customRules);
    
    assertEquals(results[0].value, 'Lucky'); // 7
    assertEquals(results[4].value, 'Eleven'); // 11
    assertEquals(results[7].value, 'Lucky'); // 14
  });
});