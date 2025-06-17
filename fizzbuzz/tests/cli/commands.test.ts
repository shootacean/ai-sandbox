import { assertEquals } from '@std/assert';
import { 
  runFizzBuzzCommand, 
  CommandBuilder, 
  quickFizzBuzz, 
  quickFizzBuzzJson, 
  quickCustomFizzBuzz 
} from '../../src/cli/commands.ts';

Deno.test('runFizzBuzzCommand', async (t) => {
  await t.step('should run with default args', async () => {
    const result = await runFizzBuzzCommand({
      start: 1,
      end: 5,
      format: 'numbered'
    });
    
    const lines = result.split('\n');
    assertEquals(lines.length, 5);
    assertEquals(lines[0], '1: 1');
    assertEquals(lines[1], '2: 2');
    assertEquals(lines[2], '3: Fizz');
    assertEquals(lines[3], '4: 4');
    assertEquals(lines[4], '5: Buzz');
  });

  await t.step('should run with custom rules', async () => {
    const result = await runFizzBuzzCommand({
      start: 7,
      end: 14,
      format: 'plain',
      rules: ['7:Lucky', '11:Eleven']
    });
    
    const lines = result.split('\n');
    assertEquals(lines[0], 'Lucky'); // 7
    assertEquals(lines[4], 'Eleven'); // 11
    assertEquals(lines[7], 'Lucky'); // 14
  });

  await t.step('should run with JSON format', async () => {
    const result = await runFizzBuzzCommand({
      start: 3,
      end: 3,
      format: 'json'
    });
    
    const parsed = JSON.parse(result);
    assertEquals(Array.isArray(parsed), true);
    assertEquals(parsed[0].number, 3);
    assertEquals(parsed[0].value, 'Fizz');
  });
});

Deno.test('CommandBuilder', async (t) => {
  await t.step('should build and execute command', async () => {
    const result = await new CommandBuilder()
      .setStart(1)
      .setEnd(3)
      .setFormat('plain')
      .execute();
    
    assertEquals(result, '1\n2\nFizz');
  });

  await t.step('should handle custom rules', async () => {
    const result = await new CommandBuilder()
      .setStart(7)
      .setEnd(7)
      .addRule('7:Lucky')
      .setFormat('plain')
      .execute();
    
    assertEquals(result, 'Lucky');
  });

  await t.step('should add multiple rules', async () => {
    const builder = new CommandBuilder()
      .addRules(['7:Lucky', '11:Eleven']);
    
    const args = builder.getArgs();
    assertEquals(args.rules, ['7:Lucky', '11:Eleven']);
  });

  await t.step('should clear rules', async () => {
    const builder = new CommandBuilder()
      .addRule('7:Lucky')
      .clearRules()
      .addRule('11:Eleven');
    
    const args = builder.getArgs();
    assertEquals(args.rules, ['11:Eleven']);
  });

  await t.step('should reset to defaults', async () => {
    const builder = new CommandBuilder()
      .setStart(10)
      .setEnd(20)
      .reset();
    
    const args = builder.getArgs();
    assertEquals(args, {});
  });
});

Deno.test('Quick functions', async (t) => {
  await t.step('should run quick FizzBuzz', async () => {
    const result = await quickFizzBuzz(1, 3);
    const lines = result.split('\n');
    
    assertEquals(lines.length, 3);
    assertEquals(lines[0], '1: 1');
    assertEquals(lines[1], '2: 2');
    assertEquals(lines[2], '3: Fizz');
  });

  await t.step('should run quick JSON FizzBuzz', async () => {
    const result = await quickFizzBuzzJson(3, 3);
    const parsed = JSON.parse(result);
    
    assertEquals(Array.isArray(parsed), true);
    assertEquals(parsed[0].number, 3);
    assertEquals(parsed[0].value, 'Fizz');
  });

  await t.step('should run quick custom FizzBuzz', async () => {
    const result = await quickCustomFizzBuzz(7, 7, ['7:Lucky']);
    assertEquals(result, '7: Lucky');
  });
});