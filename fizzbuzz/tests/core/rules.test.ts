import { assertEquals, assertThrows } from '@std/assert';
import { 
  DefaultRuleEvaluator,
  CompositeRuleEvaluator,
  RuleBuilder,
  STANDARD_RULES,
  validateRule,
  validateRules,
  parseRuleString
} from '../../src/core/rules.ts';
import { InvalidRuleError } from '../../src/types/index.ts';

Deno.test('Rule validation', async (t) => {
  await t.step('should validate correct rules', () => {
    const validRule = { divisor: 3, replacement: 'Fizz' };
    validateRule(validRule); // Should not throw
  });

  await t.step('should reject invalid rules', () => {
    assertThrows(
      () => validateRule({ divisor: 0, replacement: 'Zero' }),
      InvalidRuleError,
      'Rule divisor must be a positive integer'
    );

    assertThrows(
      () => validateRule({ divisor: 3.5, replacement: 'Float' }),
      InvalidRuleError,
      'Rule divisor must be a positive integer'
    );

    assertThrows(
      () => validateRule({ divisor: 3, replacement: '' }),
      InvalidRuleError,
      'Rule replacement must be a non-empty string'
    );

    assertThrows(
      () => validateRule(null as any),
      InvalidRuleError,
      'Rule must be an object'
    );
  });

  await t.step('should validate rule arrays', () => {
    validateRules([{ divisor: 3, replacement: 'Fizz' }]); // Should not throw

    assertThrows(
      () => validateRules([]),
      InvalidRuleError,
      'Rules must be a non-empty array'
    );

    assertThrows(
      () => validateRules([
        { divisor: 3, replacement: 'Fizz' },
        { divisor: 3, replacement: 'Buzz' }
      ]),
      InvalidRuleError,
      'Duplicate divisors found'
    );
  });

  await t.step('should parse rule strings', () => {
    const rule = parseRuleString('7:Lucky');
    assertEquals(rule.divisor, 7);
    assertEquals(rule.replacement, 'Lucky');

    assertThrows(
      () => parseRuleString('invalid'),
      InvalidRuleError,
      'Invalid rule format'
    );

    assertThrows(
      () => parseRuleString('abc:Lucky'),
      InvalidRuleError,
      'Invalid divisor'
    );
  });
});

Deno.test('DefaultRuleEvaluator', async (t) => {
  await t.step('should evaluate with standard rules', () => {
    const evaluator = new DefaultRuleEvaluator(STANDARD_RULES);
    
    assertEquals(evaluator.evaluate(3).value, 'Fizz');
    assertEquals(evaluator.evaluate(5).value, 'Buzz');
    assertEquals(evaluator.evaluate(15).value, 'FizzBuzz');
    assertEquals(evaluator.evaluate(7).value, '7');
  });

  await t.step('should prioritize higher divisors', () => {
    const rules = [
      { divisor: 3, replacement: 'Three' },
      { divisor: 6, replacement: 'Six' },
    ];
    const evaluator = new DefaultRuleEvaluator(rules);
    
    // 6 should match the 6-divisor rule, not the 3-divisor rule
    assertEquals(evaluator.evaluate(6).value, 'Six');
    assertEquals(evaluator.evaluate(12).value, 'Six');
    assertEquals(evaluator.evaluate(9).value, 'Three');
  });

  await t.step('should track matched rules', () => {
    const evaluator = new DefaultRuleEvaluator(STANDARD_RULES);
    const result = evaluator.evaluate(15);
    
    assertEquals(result.matchedRules.length, 1);
    assertEquals(result.matchedRules[0].divisor, 15);
    assertEquals(result.matchedRules[0].replacement, 'FizzBuzz');
  });

  await t.step('should handle edge cases', () => {
    const evaluator = new DefaultRuleEvaluator(STANDARD_RULES);
    
    assertEquals(evaluator.evaluate(0).value, 'FizzBuzz');
    assertEquals(evaluator.evaluate(-3).value, 'Fizz');
    assertEquals(evaluator.evaluate(-15).value, 'FizzBuzz');

    assertThrows(
      () => evaluator.evaluate(3.5),
      InvalidRuleError,
      'Number must be an integer'
    );
  });
});

Deno.test('CompositeRuleEvaluator', async (t) => {
  await t.step('should combine multiple matching rules', () => {
    const rules = [
      { divisor: 3, replacement: 'Fizz' },
      { divisor: 5, replacement: 'Buzz' },
    ];
    const evaluator = new CompositeRuleEvaluator(rules);
    
    assertEquals(evaluator.evaluate(3).value, 'Fizz');
    assertEquals(evaluator.evaluate(5).value, 'Buzz');
    assertEquals(evaluator.evaluate(15).value, 'FizzBuzz'); // Combined
    assertEquals(evaluator.evaluate(7).value, '7');
  });

  await t.step('should track all matched rules', () => {
    const rules = [
      { divisor: 3, replacement: 'Fizz' },
      { divisor: 5, replacement: 'Buzz' },
    ];
    const evaluator = new CompositeRuleEvaluator(rules);
    const result = evaluator.evaluate(15);
    
    assertEquals(result.matchedRules.length, 2);
    assertEquals(result.matchedRules[0].divisor, 3);
    assertEquals(result.matchedRules[1].divisor, 5);
  });
});

Deno.test('RuleBuilder', async (t) => {
  await t.step('should build rules fluently', () => {
    const rules = new RuleBuilder()
      .addRule(3, 'Fizz')
      .addRule(5, 'Buzz')
      .build();
    
    assertEquals(rules.length, 2);
    assertEquals(rules[0].divisor, 3);
    assertEquals(rules[1].divisor, 5);
  });

  await t.step('should add standard rules', () => {
    const rules = new RuleBuilder()
      .addStandardRules()
      .build();
    
    assertEquals(rules.length, 3);
    assertEquals(rules[0].divisor, 15);
    assertEquals(rules[1].divisor, 3);
    assertEquals(rules[2].divisor, 5);
  });

  await t.step('should parse rule strings', () => {
    const rules = new RuleBuilder()
      .addRules(['7:Lucky', '11:Eleven'])
      .build();
    
    assertEquals(rules.length, 2);
    assertEquals(rules[0].divisor, 7);
    assertEquals(rules[1].divisor, 11);
  });

  await t.step('should build evaluators', () => {
    const evaluator = new RuleBuilder()
      .addStandardRules()
      .buildEvaluator();
    
    assertEquals(evaluator.evaluate(15).value, 'FizzBuzz');
    
    const compositeEvaluator = new RuleBuilder()
      .addRule(3, 'Fizz')
      .addRule(5, 'Buzz')
      .buildEvaluator(true);
    
    assertEquals(compositeEvaluator.evaluate(15).value, 'FizzBuzz');
  });

  await t.step('should clear and reset', () => {
    const builder = new RuleBuilder()
      .addRule(3, 'Fizz')
      .clear()
      .addRule(5, 'Buzz');
    
    const rules = builder.build();
    assertEquals(rules.length, 1);
    assertEquals(rules[0].divisor, 5);
  });
});