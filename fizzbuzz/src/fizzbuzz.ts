/**
 * Legacy FizzBuzz Functions - Backward Compatibility Layer
 * 
 * These functions maintain the original API while using the new engine internally.
 * @deprecated Use the new FizzBuzzEngine for enhanced functionality.
 */

import { createStandardEngine, runFizzBuzz } from './core/engine.ts';

/**
 * Legacy fizzbuzz function - evaluates a single number
 * @deprecated Use FizzBuzzEngine.evaluateNumber() instead
 */
export function fizzbuzz(n: number): string {
  const engine = createStandardEngine(n, n);
  const results = engine.generateAll();
  return results[0]?.value || n.toString();
}

/**
 * Legacy generateFizzBuzz function - generates array of strings
 * @deprecated Use FizzBuzzEngine.generateAll() instead
 */
export function generateFizzBuzz(start: number = 1, end: number = 100): string[] {
  const results = runFizzBuzz(start, end);
  return results.map(result => result.value);
}

/**
 * Legacy printFizzBuzz function - prints to console
 * @deprecated Use the CLI interface or FizzBuzzEngine with formatters instead
 */
export function printFizzBuzz(start: number = 1, end: number = 100): void {
  const results = runFizzBuzz(start, end);
  results.forEach(result => {
    console.log(`${result.number}: ${result.value}`);
  });
}