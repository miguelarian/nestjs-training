import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import { HealthDto } from "./dtos/HealthDto";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should status OK and NPM version", () => {
    const expectedResponse = new HealthDto();
    expectedResponse.status = "ok";
    expectedResponse.timestamp = new Date().toISOString();
    expectedResponse.version = process.env.npm_package_version || "unknown";

    expect(controller.health()).toEqual(expectedResponse);
  });
});
