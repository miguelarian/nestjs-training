import { BadRequestException } from '@nestjs/common';
import { IsPositivePipe } from './is-positive.pipe';

describe('IsPositivePipe', () => {
  it('should return value when it is positive', () => {
    const pipe = new IsPositivePipe();

    const result = pipe.transform(5);
    
    expect(result).toBe(5);
  });

  it('should throw BadRequestException when value is zero or negative', () => {
    const pipe = new IsPositivePipe();
    
    expect(() => pipe.transform(0)).toThrow(BadRequestException);
    expect(() => pipe.transform(-3)).toThrow(BadRequestException);
  });
});
