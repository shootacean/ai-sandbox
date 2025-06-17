import { assertEquals } from '@std/assert';
import { fizzbuzz, generateFizzBuzz, printFizzBuzz } from '../src/fizzbuzz.ts';
import { assertSpyCall, assertSpyCalls, spy } from '@std/testing/mock';

Deno.test('Legacy fizzbuzz function tests', async (t) => {
  await t.step('should return "Fizz" for multiples of 3', () => {
    assertEquals(fizzbuzz(3), 'Fizz');
    assertEquals(fizzbuzz(6), 'Fizz');
    assertEquals(fizzbuzz(9), 'Fizz');
  });

  await t.step('should return "Buzz" for multiples of 5', () => {
    assertEquals(fizzbuzz(5), 'Buzz');
    assertEquals(fizzbuzz(10), 'Buzz');
    assertEquals(fizzbuzz(20), 'Buzz');
  });

  await t.step('should return "FizzBuzz" for multiples of both 3 and 5', () => {
    assertEquals(fizzbuzz(15), 'FizzBuzz');
    assertEquals(fizzbuzz(30), 'FizzBuzz');
    assertEquals(fizzbuzz(45), 'FizzBuzz');
  });

  await t.step('should return the number as string for other numbers', () => {
    assertEquals(fizzbuzz(1), '1');
    assertEquals(fizzbuzz(2), '2');
    assertEquals(fizzbuzz(4), '4');
    assertEquals(fizzbuzz(7), '7');
  });

  await t.step('should handle edge cases', () => {
    assertEquals(fizzbuzz(0), 'FizzBuzz');
    assertEquals(fizzbuzz(-3), 'Fizz');
    assertEquals(fizzbuzz(-15), 'FizzBuzz');
  });
});

Deno.test('Legacy generateFizzBuzz function tests', async (t) => {
  await t.step('should generate correct sequence for range 1-15', () => {
    const result = generateFizzBuzz(1, 15);
    const expected = [
      '1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz',
      '11', 'Fizz', '13', '14', 'FizzBuzz'
    ];
    assertEquals(result, expected);
  });

  await t.step('should handle custom range', () => {
    const result = generateFizzBuzz(13, 17);
    const expected = ['13', '14', 'FizzBuzz', '16', '17'];
    assertEquals(result, expected);
  });

  await t.step('should handle single number range', () => {
    const result = generateFizzBuzz(15, 15);
    assertEquals(result, ['FizzBuzz']);
  });

  await t.step('should handle default parameters', () => {
    const result = generateFizzBuzz();
    assertEquals(result.length, 100);
    assertEquals(result[0], '1');
    assertEquals(result[99], 'Buzz');
  });
});

Deno.test('Legacy printFizzBuzz function tests', async (t) => {
  await t.step('should print FizzBuzz sequence', () => {
    const consoleSpy = spy(console, 'log');
    
    try {
      printFizzBuzz(1, 5);
      
      assertSpyCalls(consoleSpy, 5);
      assertSpyCall(consoleSpy, 0, { args: ['1: 1'] });
      assertSpyCall(consoleSpy, 1, { args: ['2: 2'] });
      assertSpyCall(consoleSpy, 2, { args: ['3: Fizz'] });
      assertSpyCall(consoleSpy, 3, { args: ['4: 4'] });
      assertSpyCall(consoleSpy, 4, { args: ['5: Buzz'] });
    } finally {
      consoleSpy.restore();
    }
  });

  await t.step('should use default parameters', () => {
    const consoleSpy = spy(console, 'log');
    
    try {
      printFizzBuzz();
      
      // Should print 100 lines
      assertSpyCalls(consoleSpy, 100);
      assertSpyCall(consoleSpy, 0, { args: ['1: 1'] });
      assertSpyCall(consoleSpy, 99, { args: ['100: Buzz'] });
    } finally {
      consoleSpy.restore();
    }
  });
});