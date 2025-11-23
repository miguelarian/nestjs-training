import { Test, TestingModule } from "@nestjs/testing";
import { EpisodesService } from "./episodes.service";
import { ConfigModule } from "../config/config.module";
import { EpisodesRepositoryToken } from "./episodes.repository-dynamo";
import type { IEpisodesRepository } from "./interfaces/IEpisodesRepository";
import { Episode } from "./entities/Episode";
import { v4 as uuidv4 } from "uuid";

describe("EpisodesService", () => {
  let service: EpisodesService;
  let mockRepo: IEpisodesRepository;
  const inMemory: Episode[] = [];

  beforeAll(async () => {
    for (let i = 1; i <= 3; i++) {
      inMemory.push(
        Episode.fromData(
          uuidv4(),
          `Episode ${i}`,
          false,
          new Date(Date.now() + i * 1000),
        ),
      );
    }

    mockRepo = {
      add: jest.fn(),
      findFeatured: jest.fn(),
      findAll: jest.fn().mockImplementation(() => {
        return Promise.resolve(inMemory);
      }),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        EpisodesService,
        { provide: EpisodesRepositoryToken, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<EpisodesService>(EpisodesService);
  });

  it("findAll should return all episodes in ascending order by date by default", async () => {
    const result = await service.findAll();
    expect(result[0].id.localeCompare(result[0].id)).toBeLessThan(1);
    expect(result[1].id.localeCompare(result[1].id)).toBeLessThan(2);
  });

  it("findById should return undefined when no episodes exist for a invalid ID", async () => {
    const nonExistingId = "invalid-id";
    const episode = await service.findById(nonExistingId);
    expect(episode).toBeUndefined();
  });

  it("findById should return the correct episode for a valid ID", async () => {
    const existingId = inMemory[0].id;
    mockRepo.findById = jest.fn().mockImplementation((id: string) => {
      return Promise.resolve(inMemory.find((e) => e.id === id));
    });

    const episode = await service.findById(existingId);

    expect(episode).toBeDefined();
    expect(episode?.id).toBe(existingId);
    expect(episode?.title).toBe("Episode 1");
  });
});
