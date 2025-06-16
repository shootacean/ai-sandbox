import { sayHello } from '../src/index';

describe('sayHello', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should output "Hello, World!" to console', () => {
    sayHello();
    expect(consoleSpy).toHaveBeenCalledWith('Hello, World!');
  });

  test('should call console.log exactly once', () => {
    sayHello();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});