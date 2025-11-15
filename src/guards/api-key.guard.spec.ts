import { ApiKeyGuard } from './api-key.guard';

describe('ApiKeyGuard', () => {

  beforeAll(() => {
    process.env.API_KEY = 'test-api-key';
  });

  it('should allow access with valid API key', () => {
    const guard = new ApiKeyGuard();
    const mockRequest: any = {
      headers: {
        'x-api-key': 'test-api-key',
      },
    };
    const mockExecutionContext: any = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    };

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should deny access with invalid API key', () => {
    const guard = new ApiKeyGuard();
    const mockRequest: any = {
      headers: {
        'x-api-key': 'invalid-api-key',
      },
    };
    const mockExecutionContext: any = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    };

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });

  it('should deny access when API key is missing', () => {
    const guard = new ApiKeyGuard();
    const mockRequest: any = {
      headers: {},
    };
    const mockExecutionContext: any = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    };

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });
});
