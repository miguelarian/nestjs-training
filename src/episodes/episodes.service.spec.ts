import { Test, TestingModule } from "@nestjs/testing";
import { EpisodesService } from "./episodes.service";
import { ConfigModule } from "../config/config.module";
import { EpisodeDto } from "./dtos/EpisodeDto";
import { EpisodesRepositoryToken } from "./episodes.repository-dynamo";
import type { IEpisodesRepository } from "./interfaces/IEpisodesRepository";

describe("EpisodesService", () => {
  let service: EpisodesService;

  beforeAll(async () => {
    const inMemory: EpisodeDto[] = [];
    const mockRepo: IEpisodesRepository = {
      async add(dto: EpisodeDto) {
        inMemory.push(dto);
      },
      async findAll(sort: "asc" | "desc" = "asc", limit?: number) {
        const episodes = inMemory.map(
          (e, i) =>
            ({
              id: i + 1,
              title: e.title,
              featured: !!e.featured,
              publishedAt: e.publishedAt,
            }) as any,
        );
        const sorted = episodes.sort((a, b) =>
          sort === "desc" ? b.id - a.id : a.id - b.id,
        );
        return limit ? sorted.slice(0, limit) : sorted;
      },
      async findById(id: number) {
        const dto = inMemory[id - 1];
        if (!dto) return undefined;
        return {
          id,
          title: dto.title,
          featured: !!dto.featured,
          publishedAt: dto.publishedAt,
        } as any;
      },
      async findFeatured() {
        return inMemory
          .map(
            (e, i) =>
              ({
                id: i + 1,
                title: e.title,
                featured: !!e.featured,
                publishedAt: e.publishedAt,
              }) as any,
          )
          .filter((e) => e.featured);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        EpisodesService,
        { provide: EpisodesRepositoryToken, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<EpisodesService>(EpisodesService);

    await service.add(
      new EpisodeDto({
        title: "Episode 1",
        featured: false,
        publishedAt: new Date(),
      }),
    );

    await service.add(
      new EpisodeDto({
        title: "Episode 2",
        featured: true,
        publishedAt: new Date(),
      }),
    );
    await service.add(
      new EpisodeDto({
        title: "Episode 3",
        featured: false,
        publishedAt: new Date(),
      }),
    );
    await service.add(
      new EpisodeDto({
        title: "Episode 4",
        featured: true,
        publishedAt: new Date(),
      }),
    );
  });

  it("findAll should return all episodes in ascending order by default", async () => {
    const result = await service.findAll();
    expect(result[0].id).toBeLessThan(result[1].id);
    expect(result[1].id).toBeLessThan(result[2].id);
    expect(result[2].id).toBeLessThan(result[3].id);
  });

  it("should return undefined when no episodes exist for a invalid ID", async () => {
    const nonExistingId = -1;
    const episode = await service.findById(nonExistingId);
    expect(episode).toBeUndefined();
  });

  it("findById should return the correct episode for a valid ID", async () => {
    const existingId = 1;
    const episode = await service.findById(existingId);
    expect(episode).toBeDefined();
    expect(episode?.id).toBe(existingId);
    expect(episode?.title).toBe("Episode 1");
  });
});
