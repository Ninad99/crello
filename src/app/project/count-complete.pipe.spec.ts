import { CountCompletePipe } from './count-complete.pipe';

describe('CountCompletePipe', () => {
  const pipe = new CountCompletePipe();

  const mockData = [
    { title: 'Task 1', complete: true },
    { title: 'Task 2', complete: false }
  ];

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform the array and return a string', () => {
    expect(pipe.transform(mockData)).toBe('1/2');
  });

  it('should return an empty string for an empty array', () => {
    expect(pipe.transform([])).toBe('');
  });
});
