import { ExecutionContext } from "@nestjs/common";
import { ApiKeyGuard } from "./api-key.guard";

describe("ApiKeyGuard", () => {
  beforeEach(() => {
    process.env.API_KEY = "test-api-key";
  });

  it("should allow access with valid API key", () => {
    const guard = new ApiKeyGuard();
    const mockRequest = {
      headers: {
        "x-api-key": "test-api-key",
      },
    };
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it("should deny access with invalid API key", () => {
    const guard = new ApiKeyGuard();
    const mockRequest = {
      headers: {
        "x-api-key": "invalid-api-key",
      },
    };
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });

  it("should deny access when API key is missing", () => {
    const guard = new ApiKeyGuard();
    const mockRequest = {
      headers: {},
    };
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });
});
