import type { FizzBuzzRule, FizzBuzzResult, RuleEvaluator } from '../types/index.ts';
import { InvalidRuleError } from '../types/index.ts';

/**
 * Standard FizzBuzz rules
 */
export const STANDARD_RULES: FizzBuzzRule[] = [
  { divisor: 15, replacement: 'FizzBuzz' }, // Must come before 3 and 5 for correct evaluation
  { divisor: 3, replacement: 'Fizz' },
  { divisor: 5, replacement: 'Buzz' },
];

/**
 * Validates a FizzBuzz rule
 */
export function validateRule(rule: FizzBuzzRule): void {
  if (!rule || typeof rule !== 'object') {
    throw new InvalidRuleError('Rule must be an object');
  }
  
  if (!Number.isInteger(rule.divisor) || rule.divisor <= 0) {
    throw new InvalidRuleError('Rule divisor must be a positive integer');
  }
  
  if (typeof rule.replacement !== 'string' || rule.replacement.length === 0) {
    throw new InvalidRuleError('Rule replacement must be a non-empty string');
  }
}

/**
 * Validates an array of FizzBuzz rules
 */
export function validateRules(rules: FizzBuzzRule[]): void {
  if (!Array.isArray(rules) || rules.length === 0) {
    throw new InvalidRuleError('Rules must be a non-empty array');
  }
  
  rules.forEach((rule, index) => {
    try {
      validateRule(rule);
    } catch (error) {
      if (error instanceof InvalidRuleError) {
        throw new InvalidRuleError(`Invalid rule at index ${index}: ${error.message}`);
      }
      throw error;
    }
  });
  
  // Check for duplicate divisors
  const divisors = rules.map(rule => rule.divisor);
  const duplicates = divisors.filter((divisor, index) => divisors.indexOf(divisor) !== index);
  if (duplicates.length > 0) {
    throw new InvalidRuleError(`Duplicate divisors found: ${duplicates.join(', ')}`);
  }
}

/**
 * Creates a FizzBuzz rule from a string in format "divisor:replacement"
 */
export function parseRuleString(ruleString: string): FizzBuzzRule {
  const parts = ruleString.split(':');
  if (parts.length !== 2) {
    throw new InvalidRuleError(`Invalid rule format: "${ruleString}". Expected format: "divisor:replacement"`);
  }
  
  const divisor = parseInt(parts[0], 10);
  const replacement = parts[1];
  
  if (isNaN(divisor)) {
    throw new InvalidRuleError(`Invalid divisor: "${parts[0]}". Must be a number`);
  }
  
  const rule = { divisor, replacement };
  validateRule(rule);
  return rule;
}

/**
 * Default rule evaluator implementation
 */
export class DefaultRuleEvaluator implements RuleEvaluator {
  constructor(private rules: FizzBuzzRule[]) {
    validateRules(rules);
    // Sort rules by divisor in descending order to ensure correct evaluation
    // (e.g., 15 should be checked before 3 and 5)
    this.rules = [...rules].sort((a, b) => b.divisor - a.divisor);
  }

  evaluate(number: number): FizzBuzzResult {
    if (!Number.isInteger(number)) {
      throw new InvalidRuleError('Number must be an integer');
    }

    const matchedRules: FizzBuzzRule[] = [];
    let value = '';

    // Check each rule in order
    for (const rule of this.rules) {
      if (number % rule.divisor === 0) {
        matchedRules.push(rule);
        value = rule.replacement;
        break; // Take the first match (highest divisor due to sorting)
      }
    }

    // If no rules matched, use the number itself
    if (matchedRules.length === 0) {
      value = number.toString();
    }

    return {
      number,
      value,
      matchedRules,
    };
  }
}

/**
 * Composite rule evaluator that combines multiple rules
 * This allows for more complex scenarios like "FizzBuzz" for numbers divisible by both 3 and 5
 */
export class CompositeRuleEvaluator implements RuleEvaluator {
  constructor(private rules: FizzBuzzRule[]) {
    validateRules(rules);
    this.rules = [...rules];
  }

  evaluate(number: number): FizzBuzzResult {
    if (!Number.isInteger(number)) {
      throw new InvalidRuleError('Number must be an integer');
    }

    const matchedRules: FizzBuzzRule[] = [];
    const replacements: string[] = [];

    // Check all rules and collect matches
    for (const rule of this.rules) {
      if (number % rule.divisor === 0) {
        matchedRules.push(rule);
        replacements.push(rule.replacement);
      }
    }

    // Combine all replacements or use the number
    const value = replacements.length > 0 ? replacements.join('') : number.toString();

    return {
      number,
      value,
      matchedRules,
    };
  }
}

/**
 * Rule builder for fluent API construction
 */
export class RuleBuilder {
  private rules: FizzBuzzRule[] = [];

  /**
   * Add a rule
   */
  addRule(divisor: number, replacement: string): RuleBuilder {
    const rule = { divisor, replacement };
    validateRule(rule);
    this.rules.push(rule);
    return this;
  }

  /**
   * Add multiple rules from strings
   */
  addRules(ruleStrings: string[]): RuleBuilder {
    for (const ruleString of ruleStrings) {
      const rule = parseRuleString(ruleString);
      this.rules.push(rule);
    }
    return this;
  }

  /**
   * Add standard FizzBuzz rules
   */
  addStandardRules(): RuleBuilder {
    this.rules.push(...STANDARD_RULES);
    return this;
  }

  /**
   * Build the rules array
   */
  build(): FizzBuzzRule[] {
    validateRules(this.rules);
    return [...this.rules];
  }

  /**
   * Build a rule evaluator
   */
  buildEvaluator(composite = false): RuleEvaluator {
    const rules = this.build();
    return composite ? new CompositeRuleEvaluator(rules) : new DefaultRuleEvaluator(rules);
  }

  /**
   * Clear all rules
   */
  clear(): RuleBuilder {
    this.rules = [];
    return this;
  }
}