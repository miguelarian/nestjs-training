import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "./config.service";

describe("ConfigService", () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  describe("getDynamoDbConfig", () => {
    it("should return the Episodes table name", () => {
      expect(service.episodesTableName).toBe("Episodes");
    });
  });
});
