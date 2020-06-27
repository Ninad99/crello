import { CountCompletePipe } from './count-complete.pipe';

describe('CountCompletePipe', () => {
  it('create an instance', () => {
    const pipe = new CountCompletePipe();
    expect(pipe).toBeTruthy();
  });
});
