import { assertEquals } from '@std/assert';
import { executeCommand } from '../src/cli/commands.ts';
import { assertSpyCall, assertSpyCalls, spy } from '@std/testing/mock';

Deno.test('CLI integration tests', async (t) => {
  await t.step('should execute help command', async () => {
    const consoleSpy = spy(console, 'log');
    
    try {
      const exitCode = await executeCommand(['--help']);
      assertEquals(exitCode, 0);
      assertSpyCalls(consoleSpy, 1);
      
      const output = consoleSpy.calls[0].args[0];
      assertEquals(output.includes('FizzBuzz v2.0.0'), true);
      assertEquals(output.includes('USAGE:'), true);
    } finally {
      consoleSpy.restore();
    }
  });

  await t.step('should execute version command', async () => {
    const consoleSpy = spy(console, 'log');
    
    try {
      const exitCode = await executeCommand(['--version']);
      assertEquals(exitCode, 0);
      assertSpyCalls(consoleSpy, 1);
      assertSpyCall(consoleSpy, 0, { args: ['FizzBuzz v2.0.0'] });
    } finally {
      consoleSpy.restore();
    }
  });

  await t.step('should execute default FizzBuzz command', async () => {
    const consoleSpy = spy(console, 'log');
    
    try {
      const exitCode = await executeCommand([]);
      assertEquals(exitCode, 0);
      assertSpyCalls(consoleSpy, 1);
      
      const output = consoleSpy.calls[0].args[0];
      const lines = output.split('\n');
      assertEquals(lines.length, 100);
      assertEquals(lines[0], '1: 1');
      assertEquals(lines[2], '3: Fizz');
      assertEquals(lines[4], '5: Buzz');
      assertEquals(lines[14], '15: FizzBuzz');
      assertEquals(lines[99], '100: Buzz');
    } finally {
      consoleSpy.restore();
    }
  });

  await t.step('should execute with custom range', async () => {
    const consoleSpy = spy(console, 'log');
    
    try {
      const exitCode = await executeCommand(['--start', '3', '--end', '5']);
      assertEquals(exitCode, 0);
      assertSpyCalls(consoleSpy, 1);
      
      const output = consoleSpy.calls[0].args[0];
      const lines = output.split('\n');
      assertEquals(lines.length, 3);
      assertEquals(lines[0], '3: Fizz');
      assertEquals(lines[1], '4: 4');
      assertEquals(lines[2], '5: Buzz');
    } finally {
      consoleSpy.restore();
    }
  });

  await t.step('should execute with JSON format', async () => {
    const consoleSpy = spy(console, 'log');
    
    try {
      const exitCode = await executeCommand(['--start', '15', '--end', '15', '--format', 'json']);
      assertEquals(exitCode, 0);
      assertSpyCalls(consoleSpy, 1);
      
      const output = consoleSpy.calls[0].args[0];
      const parsed = JSON.parse(output);
      assertEquals(Array.isArray(parsed), true);
      assertEquals(parsed[0].number, 15);
      assertEquals(parsed[0].value, 'FizzBuzz');
    } finally {
      consoleSpy.restore();
    }
  });

  await t.step('should execute with custom rules', async () => {
    const consoleSpy = spy(console, 'log');
    
    try {
      const exitCode = await executeCommand([
        '--start', '7', '--end', '14', 
        '--rule', '7:Lucky', '--rule', '11:Eleven',
        '--format', 'plain'
      ]);
      assertEquals(exitCode, 0);
      assertSpyCalls(consoleSpy, 1);
      
      const output = consoleSpy.calls[0].args[0];
      const lines = output.split('\n');
      assertEquals(lines[0], 'Lucky'); // 7
      assertEquals(lines[4], 'Eleven'); // 11
      assertEquals(lines[7], 'Lucky'); // 14
    } finally {
      consoleSpy.restore();
    }
  });

  await t.step('should handle invalid arguments', async () => {
    const consoleErrorSpy = spy(console, 'error');
    
    try {
      const exitCode = await executeCommand(['--unknown']);
      assertEquals(exitCode, 1);
      assertSpyCalls(consoleErrorSpy, 1);
      
      const errorOutput = consoleErrorSpy.calls[0].args[0];
      assertEquals(errorOutput.includes('Error:'), true);
      assertEquals(errorOutput.includes('Use --help'), true);
    } finally {
      consoleErrorSpy.restore();
    }
  });
});