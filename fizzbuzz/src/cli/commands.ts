import type { CliArgs, FizzBuzzConfig } from '../types/index.ts';
import { FizzBuzzEngine } from '../core/engine.ts';
import { RuleBuilder } from '../core/rules.ts';
import { formatResults } from '../core/formatters.ts';
import { parseArgs, validateArgs } from './parser.ts';
import { getHelpText, getVersionText, getErrorMessage } from './help.ts';

/**
 * Main command execution function
 */
export async function executeCommand(args: string[]): Promise<number> {
  try {
    const parsedArgs = parseArgs(args);
    
    // Handle help and version first
    if (parsedArgs.help) {
      console.log(getHelpText());
      return 0;
    }
    
    if (parsedArgs.version) {
      console.log(getVersionText());
      return 0;
    }
    
    // Validate arguments
    validateArgs(parsedArgs);
    
    // Execute FizzBuzz
    const result = await runFizzBuzzCommand(parsedArgs);
    console.log(result);
    
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(getErrorMessage(message));
    return 1;
  }
}

/**
 * Run the FizzBuzz command with parsed arguments
 */
export async function runFizzBuzzCommand(args: CliArgs): Promise<string> {
  // Build rules
  const ruleBuilder = new RuleBuilder();
  
  if (args.rules && args.rules.length > 0) {
    // Use custom rules
    ruleBuilder.addRules(args.rules);
  } else {
    // Use standard rules
    ruleBuilder.addStandardRules();
  }
  
  const rules = ruleBuilder.build();
  
  // Create configuration
  const config: FizzBuzzConfig = {
    rules,
    start: args.start!,
    end: args.end!,
  };
  
  // Create and run engine
  const engine = new FizzBuzzEngine(config);
  const results = engine.generateAll();
  
  // Format output
  const outputOptions = {
    includeNumber: args.format === 'plain' ? false : true,
    prettyJson: args.format === 'json',
  };
  
  return formatResults(results, args.format!, outputOptions);
}

/**
 * Interactive command builder for scripting
 */
export class CommandBuilder {
  private args: CliArgs = {};
  
  /**
   * Set the start number
   */
  setStart(start: number): CommandBuilder {
    this.args.start = start;
    return this;
  }
  
  /**
   * Set the end number
   */
  setEnd(end: number): CommandBuilder {
    this.args.end = end;
    return this;
  }
  
  /**
   * Set the output format
   */
  setFormat(format: string): CommandBuilder {
    this.args.format = format;
    return this;
  }
  
  /**
   * Add a custom rule
   */
  addRule(rule: string): CommandBuilder {
    this.args.rules = this.args.rules || [];
    this.args.rules.push(rule);
    return this;
  }
  
  /**
   * Add multiple custom rules
   */
  addRules(rules: string[]): CommandBuilder {
    this.args.rules = this.args.rules || [];
    this.args.rules.push(...rules);
    return this;
  }
  
  /**
   * Clear all rules
   */
  clearRules(): CommandBuilder {
    this.args.rules = [];
    return this;
  }
  
  /**
   * Execute the command
   */
  async execute(): Promise<string> {
    validateArgs(this.args);
    return runFizzBuzzCommand(this.args);
  }
  
  /**
   * Get the current arguments
   */
  getArgs(): CliArgs {
    return { ...this.args };
  }
  
  /**
   * Reset to default arguments
   */
  reset(): CommandBuilder {
    this.args = {};
    return this;
  }
}

/**
 * Quick execution functions for common scenarios
 */
export async function quickFizzBuzz(start = 1, end = 100): Promise<string> {
  return new CommandBuilder()
    .setStart(start)
    .setEnd(end)
    .setFormat('numbered')
    .execute();
}

export async function quickFizzBuzzJson(start = 1, end = 100): Promise<string> {
  return new CommandBuilder()
    .setStart(start)
    .setEnd(end)
    .setFormat('json')
    .execute();
}

export async function quickCustomFizzBuzz(
  start: number,
  end: number,
  rules: string[]
): Promise<string> {
  return new CommandBuilder()
    .setStart(start)
    .setEnd(end)
    .addRules(rules)
    .setFormat('numbered')
    .execute();
}