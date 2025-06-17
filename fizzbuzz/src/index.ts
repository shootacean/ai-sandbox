/**
 * FizzBuzz Engine - Main Entry Point
 * 
 * A configurable FizzBuzz generator with multiple output formats,
 * custom rules, and both CLI and programmatic interfaces.
 */

// Core exports
export { FizzBuzzEngine, createStandardEngine, createCustomEngine, runFizzBuzz } from './core/engine.ts';
export { 
  DefaultRuleEvaluator, 
  CompositeRuleEvaluator, 
  RuleBuilder, 
  STANDARD_RULES,
  validateRule,
  validateRules,
  parseRuleString
} from './core/rules.ts';
export {
  PlainFormatter,
  NumberedFormatter,
  JsonFormatter,
  CsvFormatter,
  TableFormatter,
  CompactFormatter,
  createFormatter,
  getSupportedFormats,
  formatResults,
  formatResult
} from './core/formatters.ts';

// CLI exports
export { executeCommand, CommandBuilder, quickFizzBuzz, quickFizzBuzzJson, quickCustomFizzBuzz } from './cli/commands.ts';
export { parseArgs, validateArgs, getExamples } from './cli/parser.ts';
export { getHelpText, getVersionText, VERSION, APP_NAME } from './cli/help.ts';

// Type exports
export type {
  FizzBuzzRule,
  FizzBuzzConfig,
  FizzBuzzResult,
  OutputOptions,
  CliArgs,
  RuleEvaluator,
  OutputFormatter
} from './types/index.ts';

// Error exports
export {
  FizzBuzzError,
  InvalidRuleError,
  InvalidRangeError,
  InvalidFormatError
} from './types/index.ts';

/**
 * Default export for simple usage
 */
export default {
  // Simple API
  run: runFizzBuzz,
  createEngine: createStandardEngine,
  
  // Builder API
  CommandBuilder,
  RuleBuilder,
  
  // Quick functions
  quick: quickFizzBuzz,
  quickJson: quickFizzBuzzJson,
  quickCustom: quickCustomFizzBuzz,
  
  // Constants
  VERSION,
  STANDARD_RULES,
};