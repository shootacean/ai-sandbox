import { getSupportedFormats } from '../core/formatters.ts';
import { getExamples } from './parser.ts';

/**
 * Application version
 */
export const VERSION = '2.0.0';

/**
 * Application name
 */
export const APP_NAME = 'FizzBuzz';

/**
 * Generate help text
 */
export function getHelpText(): string {
  const formats = getSupportedFormats();
  const examples = getExamples();
  
  return `${APP_NAME} v${VERSION}

A configurable FizzBuzz generator with multiple output formats and custom rules.

USAGE:
    fizzbuzz [OPTIONS] [START] [END]

ARGUMENTS:
    START    Starting number (default: 1)
    END      Ending number (default: 100)

OPTIONS:
    -s, --start <NUMBER>     Starting number
    -e, --end <NUMBER>       Ending number
    -f, --format <FORMAT>    Output format (default: numbered)
    -r, --rule <RULE>        Add custom rule in format "divisor:replacement"
                            Can be used multiple times
    -h, --help              Show this help message
    -v, --version           Show version information

FORMATS:
    ${formats.map(f => f.padEnd(12)).join('\n    ')}

RULE FORMAT:
    Rules should be specified as "divisor:replacement"
    Example: --rule "7:Lucky" --rule "11:Eleven"
    
    Standard FizzBuzz rules are:
    - 3:Fizz
    - 5:Buzz  
    - 15:FizzBuzz (automatically applied when both 3 and 5 match)

EXAMPLES:
    ${examples.join('\n    ')}

NOTES:
    - If custom rules are provided, they replace the standard FizzBuzz rules
    - Rules are evaluated in order of largest divisor first
    - Numbers that don't match any rule are output as-is
    - Range is limited to 1,000,000 numbers maximum`;
}

/**
 * Generate version text
 */
export function getVersionText(): string {
  return `${APP_NAME} v${VERSION}`;
}

/**
 * Generate error message with help hint
 */
export function getErrorMessage(error: string): string {
  return `Error: ${error}

Use --help for usage information.`;
}

/**
 * Generate success message for completion
 */
export function getCompletionMessage(count: number, format: string): string {
  return `Generated ${count} FizzBuzz results in ${format} format.`;
}