import type { FizzBuzzResult, OutputFormatter, OutputOptions } from '../types/index.ts';
import { InvalidFormatError } from '../types/index.ts';

/**
 * Plain text formatter - just outputs the values
 */
export class PlainFormatter implements OutputFormatter {
  formatResult(result: FizzBuzzResult, options?: OutputOptions): string {
    if (options?.includeNumber) {
      return `${result.number}: ${result.value}`;
    }
    return result.value;
  }

  formatResults(results: FizzBuzzResult[], options?: OutputOptions): string {
    return results
      .map(result => this.formatResult(result, options))
      .join('\n');
  }
}

/**
 * Numbered formatter - always includes the number
 */
export class NumberedFormatter implements OutputFormatter {
  formatResult(result: FizzBuzzResult): string {
    return `${result.number}: ${result.value}`;
  }

  formatResults(results: FizzBuzzResult[]): string {
    return results
      .map(result => this.formatResult(result))
      .join('\n');
  }
}

/**
 * JSON formatter - outputs structured JSON
 */
export class JsonFormatter implements OutputFormatter {
  formatResult(result: FizzBuzzResult, options?: OutputOptions): string {
    const data = {
      number: result.number,
      value: result.value,
      matchedRules: result.matchedRules.map(rule => ({
        divisor: rule.divisor,
        replacement: rule.replacement,
      })),
    };

    return JSON.stringify(data, null, options?.prettyJson ? 2 : 0);
  }

  formatResults(results: FizzBuzzResult[], options?: OutputOptions): string {
    const data = results.map(result => ({
      number: result.number,
      value: result.value,
      matchedRules: result.matchedRules.map(rule => ({
        divisor: rule.divisor,
        replacement: rule.replacement,
      })),
    }));

    return JSON.stringify(data, null, options?.prettyJson ? 2 : 0);
  }
}

/**
 * CSV formatter - outputs comma-separated values
 */
export class CsvFormatter implements OutputFormatter {
  private readonly defaultSeparator = ',';

  formatResult(result: FizzBuzzResult, options?: OutputOptions): string {
    const separator = options?.separator || this.defaultSeparator;
    const matchedRulesList = result.matchedRules
      .map(rule => `${rule.divisor}:${rule.replacement}`)
      .join(';');
    
    return [
      result.number,
      `"${result.value}"`,
      `"${matchedRulesList}"`,
    ].join(separator);
  }

  formatResults(results: FizzBuzzResult[], options?: OutputOptions): string {
    const separator = options?.separator || this.defaultSeparator;
    const header = ['Number', 'Value', 'Matched Rules'].join(separator);
    const rows = results.map(result => this.formatResult(result, options));
    return [header, ...rows].join('\n');
  }
}

/**
 * Table formatter - outputs a formatted table
 */
export class TableFormatter implements OutputFormatter {
  formatResult(result: FizzBuzzResult): string {
    const matchedRules = result.matchedRules
      .map(rule => `${rule.divisor}:${rule.replacement}`)
      .join(', ') || 'none';
    
    return `| ${result.number.toString().padStart(6)} | ${result.value.padEnd(10)} | ${matchedRules.padEnd(20)} |`;
  }

  formatResults(results: FizzBuzzResult[]): string {
    const header = '| Number | Value      | Matched Rules        |';
    const separator = '|--------|------------|----------------------|';
    const rows = results.map(result => this.formatResult(result));
    return [header, separator, ...rows].join('\n');
  }
}

/**
 * Compact formatter - outputs only the values in a single line
 */
export class CompactFormatter implements OutputFormatter {
  formatResult(result: FizzBuzzResult): string {
    return result.value;
  }

  formatResults(results: FizzBuzzResult[], options?: OutputOptions): string {
    const separator = options?.separator || ' ';
    return results
      .map(result => this.formatResult(result))
      .join(separator);
  }
}

/**
 * Factory function to create formatters
 */
export function createFormatter(format: string): OutputFormatter {
  switch (format.toLowerCase()) {
    case 'plain':
      return new PlainFormatter();
    case 'numbered':
      return new NumberedFormatter();
    case 'json':
      return new JsonFormatter();
    case 'csv':
      return new CsvFormatter();
    case 'table':
      return new TableFormatter();
    case 'compact':
      return new CompactFormatter();
    default:
      throw new InvalidFormatError(`Unknown format: ${format}. Supported formats: plain, numbered, json, csv, table, compact`);
  }
}

/**
 * Get list of supported formats
 */
export function getSupportedFormats(): string[] {
  return ['plain', 'numbered', 'json', 'csv', 'table', 'compact'];
}

/**
 * Utility function to format results with options
 */
export function formatResults(
  results: FizzBuzzResult[],
  format: string = 'plain',
  options?: OutputOptions
): string {
  const formatter = createFormatter(format);
  return formatter.formatResults(results, options);
}

/**
 * Utility function to format a single result
 */
export function formatResult(
  result: FizzBuzzResult,
  format: string = 'plain',
  options?: OutputOptions
): string {
  const formatter = createFormatter(format);
  return formatter.formatResult(result, options);
}