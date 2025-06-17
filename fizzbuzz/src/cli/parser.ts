import type { CliArgs } from '../types/index.ts';

/**
 * Parse command line arguments
 */
export function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-h':
      case '--help':
        result.help = true;
        break;
        
      case '-v':
      case '--version':
        result.version = true;
        break;
        
      case '-s':
      case '--start':
        if (i + 1 < args.length) {
          const start = parseInt(args[i + 1], 10);
          if (!isNaN(start)) {
            result.start = start;
            i++; // Skip next argument
          } else {
            throw new Error(`Invalid start value: ${args[i + 1]}`);
          }
        } else {
          throw new Error('--start requires a value');
        }
        break;
        
      case '-e':
      case '--end':
        if (i + 1 < args.length) {
          const end = parseInt(args[i + 1], 10);
          if (!isNaN(end)) {
            result.end = end;
            i++; // Skip next argument
          } else {
            throw new Error(`Invalid end value: ${args[i + 1]}`);
          }
        } else {
          throw new Error('--end requires a value');
        }
        break;
        
      case '-f':
      case '--format':
        if (i + 1 < args.length) {
          result.format = args[i + 1];
          i++; // Skip next argument
        } else {
          throw new Error('--format requires a value');
        }
        break;
        
      case '-r':
      case '--rule':
      case '--rules':
        if (i + 1 < args.length) {
          result.rules = result.rules || [];
          result.rules.push(args[i + 1]);
          i++; // Skip next argument
        } else {
          throw new Error('--rule requires a value');
        }
        break;
        
      default:
        // Handle positional arguments or unknown flags
        if (arg.startsWith('-')) {
          // Try to parse as key=value
          if (arg.includes('=')) {
            const [key, value] = arg.split('=', 2);
            switch (key) {
              case '--start':
                const start = parseInt(value, 10);
                if (!isNaN(start)) {
                  result.start = start;
                } else {
                  throw new Error(`Invalid start value: ${value}`);
                }
                break;
              case '--end':
                const end = parseInt(value, 10);
                if (!isNaN(end)) {
                  result.end = end;
                } else {
                  throw new Error(`Invalid end value: ${value}`);
                }
                break;
              case '--format':
                result.format = value;
                break;
              case '--rule':
              case '--rules':
                result.rules = result.rules || [];
                result.rules.push(value);
                break;
              default:
                throw new Error(`Unknown argument: ${key}`);
            }
          } else {
            throw new Error(`Unknown argument: ${arg}`);
          }
        } else {
          // Positional arguments - try to parse as start/end
          const num = parseInt(arg, 10);
          if (!isNaN(num)) {
            if (result.start === undefined) {
              result.start = num;
            } else if (result.end === undefined) {
              result.end = num;
            } else {
              throw new Error(`Too many positional arguments: ${arg}`);
            }
          } else {
            throw new Error(`Invalid number: ${arg}`);
          }
        }
        break;
    }
  }
  
  return result;
}

/**
 * Validate parsed arguments
 */
export function validateArgs(args: CliArgs): void {
  // Set defaults
  if (args.start === undefined) args.start = 1;
  if (args.end === undefined) args.end = 100;
  if (args.format === undefined) args.format = 'numbered';
  
  // Validate range
  if (args.start > args.end) {
    throw new Error('Start must be less than or equal to end');
  }
  
  // Validate format
  const supportedFormats = ['plain', 'numbered', 'json', 'csv', 'table', 'compact'];
  if (!supportedFormats.includes(args.format)) {
    throw new Error(`Unsupported format: ${args.format}. Supported formats: ${supportedFormats.join(', ')}`);
  }
  
  // Validate rules format
  if (args.rules) {
    for (const rule of args.rules) {
      if (!rule.includes(':')) {
        throw new Error(`Invalid rule format: ${rule}. Expected format: "divisor:replacement"`);
      }
      const [divisorStr] = rule.split(':');
      const divisor = parseInt(divisorStr, 10);
      if (isNaN(divisor) || divisor <= 0) {
        throw new Error(`Invalid divisor in rule: ${rule}. Divisor must be a positive number`);
      }
    }
  }
}

/**
 * Get argument usage examples
 */
export function getExamples(): string[] {
  return [
    'fizzbuzz',
    'fizzbuzz 1 50',
    'fizzbuzz --start 1 --end 100',
    'fizzbuzz --format json',
    'fizzbuzz --rule "7:Lucky" --rule "11:Eleven"',
    'fizzbuzz --start=10 --end=20 --format=table',
    'fizzbuzz 1 30 --format compact',
  ];
}