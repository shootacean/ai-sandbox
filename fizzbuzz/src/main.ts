#!/usr/bin/env -S deno run --allow-all

/**
 * FizzBuzz CLI Entry Point
 * 
 * Maintains backward compatibility while providing enhanced functionality.
 * Can be run directly or with command line arguments.
 */

import { executeCommand } from './cli/commands.ts';

/**
 * Main execution function
 */
async function main() {
  // Get command line arguments (excluding the script name)
  const args = Deno.args;
  
  // If no arguments provided, run default FizzBuzz (1-100)
  if (args.length === 0) {
    const exitCode = await executeCommand([]);
    Deno.exit(exitCode);
  } else {
    // Handle CLI arguments
    const exitCode = await executeCommand(args);
    Deno.exit(exitCode);
  }
}

// Run the main function if this file is executed directly
if (import.meta.main) {
  main().catch((error) => {
    console.error('Fatal error:', error.message);
    Deno.exit(1);
  });
}