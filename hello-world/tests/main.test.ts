import { describe, test, expect, vi } from 'vitest';

describe('main module', () => {
  test('should call sayHello when main module is executed', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    await import('../src/main');
    
    expect(consoleSpy).toHaveBeenCalledWith('Hello, World!');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    
    consoleSpy.mockRestore();
  });
});