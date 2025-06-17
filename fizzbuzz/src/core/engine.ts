import type { 
  FizzBuzzConfig, 
  FizzBuzzResult, 
  RuleEvaluator
} from '../types/index.ts';
import { InvalidRangeError } from '../types/index.ts';
import { DefaultRuleEvaluator, validateRules } from './rules.ts';

/**
 * Validates a FizzBuzz configuration
 */
export function validateConfig(config: FizzBuzzConfig): void {
  if (!config || typeof config !== 'object') {
    throw new InvalidRangeError('Config must be an object');
  }

  // Validate rules
  validateRules(config.rules);

  // Validate range
  if (!Number.isInteger(config.start) || !Number.isInteger(config.end)) {
    throw new InvalidRangeError('Start and end must be integers');
  }

  if (config.start > config.end) {
    throw new InvalidRangeError('Start must be less than or equal to end');
  }

  // Reasonable limits to prevent memory issues
  const range = config.end - config.start + 1;
  if (range > 1_000_000) {
    throw new InvalidRangeError('Range too large (maximum 1,000,000 numbers)');
  }
}

/**
 * Main FizzBuzz engine that orchestrates rule evaluation
 */
export class FizzBuzzEngine {
  private evaluator: RuleEvaluator;
  private config: FizzBuzzConfig;

  constructor(config: FizzBuzzConfig, evaluator?: RuleEvaluator) {
    validateConfig(config);
    this.config = { ...config };
    this.evaluator = evaluator || new DefaultRuleEvaluator(config.rules);
  }

  /**
   * Generate FizzBuzz results for the configured range
   */
  *generate(): Generator<FizzBuzzResult> {
    for (let i = this.config.start; i <= this.config.end; i++) {
      yield this.evaluator.evaluate(i);
    }
  }

  /**
   * Generate all FizzBuzz results as an array
   */
  generateAll(): FizzBuzzResult[] {
    return Array.from(this.generate());
  }

  /**
   * Generate FizzBuzz results for a specific range (overriding config)
   */
  *generateRange(start: number, end: number): Generator<FizzBuzzResult> {
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      throw new InvalidRangeError('Start and end must be integers');
    }
    
    if (start > end) {
      throw new InvalidRangeError('Start must be less than or equal to end');
    }

    for (let i = start; i <= end; i++) {
      yield this.evaluator.evaluate(i);
    }
  }

  /**
   * Evaluate a single number
   */
  evaluateNumber(number: number): FizzBuzzResult {
    return this.evaluator.evaluate(number);
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<FizzBuzzConfig> {
    return { ...this.config };
  }

  /**
   * Get statistics about the current configuration
   */
  getStats(): {
    totalNumbers: number;
    ruleCount: number;
    range: { start: number; end: number };
  } {
    return {
      totalNumbers: this.config.end - this.config.start + 1,
      ruleCount: this.config.rules.length,
      range: { start: this.config.start, end: this.config.end },
    };
  }
}

/**
 * Factory function to create a FizzBuzz engine with standard rules
 */
export function createStandardEngine(start = 1, end = 100): FizzBuzzEngine {
  const config: FizzBuzzConfig = {
    rules: [
      { divisor: 15, replacement: 'FizzBuzz' },
      { divisor: 3, replacement: 'Fizz' },
      { divisor: 5, replacement: 'Buzz' },
    ],
    start,
    end,
  };
  
  return new FizzBuzzEngine(config);
}

/**
 * Factory function to create a FizzBuzz engine with custom rules
 */
export function createCustomEngine(
  config: FizzBuzzConfig,
  evaluator?: RuleEvaluator
): FizzBuzzEngine {
  return new FizzBuzzEngine(config, evaluator);
}

/**
 * Utility function to run FizzBuzz with a simple API
 */
export function runFizzBuzz(
  start: number = 1,
  end: number = 100,
  customRules?: Array<{ divisor: number; replacement: string }>
): FizzBuzzResult[] {
  const rules = customRules || [
    { divisor: 15, replacement: 'FizzBuzz' },
    { divisor: 3, replacement: 'Fizz' },
    { divisor: 5, replacement: 'Buzz' },
  ];

  const config: FizzBuzzConfig = { rules, start, end };
  const engine = new FizzBuzzEngine(config);
  return engine.generateAll();
}