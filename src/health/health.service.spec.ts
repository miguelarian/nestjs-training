import { HealthService } from "./health.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("HealthService", () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it("should get status ok and package version", () => {
    process.env.npm_package_version = "1.0.0";

    const result = service.health();

    expect(result.status).toBe("ok");
    expect(result.version).toBe("1.0.0");
  });

  it("should get status ok and default version", () => {
    delete process.env.npm_package_version;

    const result = service.health();

    expect(result.status).toBe("ok");
    expect(result.version).toBe("unknown");
  });
});
