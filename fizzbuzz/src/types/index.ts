/**
 * Core type definitions for the FizzBuzz engine
 */

/** Represents a single FizzBuzz rule */
export interface FizzBuzzRule {
  /** The divisor to check against */
  divisor: number;
  /** The replacement word when the number is divisible by the divisor */
  replacement: string;
}

/** Configuration for the FizzBuzz engine */
export interface FizzBuzzConfig {
  /** Array of rules to apply in order */
  rules: FizzBuzzRule[];
  /** Start of the range (inclusive) */
  start: number;
  /** End of the range (inclusive) */
  end: number;
}

/** Result of a single FizzBuzz evaluation */
export interface FizzBuzzResult {
  /** The original number */
  number: number;
  /** The result string (either the number or replacement) */
  value: string;
  /** Array of rules that matched this number */
  matchedRules: FizzBuzzRule[];
}

/** Options for output formatting */
export interface OutputOptions {
  /** Format type */
  format?: 'plain' | 'json' | 'csv' | 'numbered';
  /** Whether to include the original number in output */
  includeNumber?: boolean;
  /** Custom separator for CSV format */
  separator?: string;
  /** Pretty print JSON output */
  prettyJson?: boolean;
}

/** CLI argument configuration */
export interface CliArgs {
  /** Start of range */
  start?: number;
  /** End of range */
  end?: number;
  /** Custom rules in format "divisor:replacement" */
  rules?: string[];
  /** Output format */
  format?: string;
  /** Show help */
  help?: boolean;
  /** Show version */
  version?: boolean;
}

/** Interface for rule evaluation strategies */
export interface RuleEvaluator {
  /** Evaluate a number against the configured rules */
  evaluate(number: number): FizzBuzzResult;
}

/** Interface for output formatting strategies */
export interface OutputFormatter {
  /** Format a single result */
  formatResult(result: FizzBuzzResult, options?: OutputOptions): string;
  /** Format multiple results */
  formatResults(results: FizzBuzzResult[], options?: OutputOptions): string;
}

/** Error types for the FizzBuzz engine */
export class FizzBuzzError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'FizzBuzzError';
  }
}

export class InvalidRuleError extends FizzBuzzError {
  constructor(message: string) {
    super(message, 'INVALID_RULE');
  }
}

export class InvalidRangeError extends FizzBuzzError {
  constructor(message: string) {
    super(message, 'INVALID_RANGE');
  }
}

export class InvalidFormatError extends FizzBuzzError {
  constructor(message: string) {
    super(message, 'INVALID_FORMAT');
  }
}