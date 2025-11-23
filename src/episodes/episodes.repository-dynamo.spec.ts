import { TestDatabaseSetup } from "../../test/test-setup";
import { Episode } from "./entities/Episode";
import { EpisodesDynamoRepository } from "./episodes.repository-dynamo";

describe("Episodes DynamoDB integration tests", () => {
  let repository: EpisodesDynamoRepository;

  beforeAll(async () => {
    await TestDatabaseSetup.startDynamoDBContainer();
    await TestDatabaseSetup.createEpisodesTable();
    repository = new EpisodesDynamoRepository();
  }, 60000); // Increase timeout for container startup

  beforeEach(async () => {
    await TestDatabaseSetup.cleanupEpisodesTable();
    await TestDatabaseSetup.createEpisodesTable();
  });

  afterAll(async () => {
    await TestDatabaseSetup.stopDynamoDBContainer();
  });

  describe("add episodes", () => {
    it("should add an episode to the database", async () => {
      const episode = Episode.create(
        "Test Episode 1",
        false,
        new Date("2024-01-01T00:00:00Z"),
      );

      // Act
      const result = await repository.add(episode);

      // Assert
      expect(result).toBeInstanceOf(Episode);
      expect(result.id).toBeDefined();
      expect(result.title).toBe("Test Episode 1");
      expect(result.featured).toBe(false);
      expect(result.publishedAt).toEqual(new Date("2024-01-01T00:00:00Z"));
    });
  });

  describe("findById", () => {
    it("should find an episode by id", async () => {
      // Arrange
      const episode = Episode.create(
        "Findable Episode",
        true,
        new Date("2024-03-01T00:00:00Z"),
      );

      const addedEpisode = await repository.add(episode);

      // Act
      const result = await repository.findById(addedEpisode.id);

      // Assert
      expect(result).toBeInstanceOf(Episode);
      expect(result!.id).toBe(addedEpisode.id);
      expect(result!.title).toBe("Findable Episode");
      expect(result!.featured).toBe(true);
      expect(result!.publishedAt).toEqual(new Date("2024-03-01T00:00:00Z"));
    });

    it("should return undefined for non-existent episode", async () => {
      // Act
      const result = await repository.findById("non-existent-id");

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe("findAll", () => {
    beforeEach(async () => {
      // Add test data
      await repository.add(
        Episode.create("Episode 1", false, new Date("2024-01-01T00:00:00Z")),
      );
      await repository.add(
        Episode.create("Episode 2", true, new Date("2024-02-01T00:00:00Z")),
      );
      await repository.add(
        Episode.create("Episode 3", false, new Date("2024-03-01T00:00:00Z")),
      );
    });

    it("should return all episodes sorted by date ascending by default", async () => {
      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].title).toBe("Episode 1");
      expect(result[1].title).toBe("Episode 2");
      expect(result[2].title).toBe("Episode 3");
    });

    it("should return all episodes sorted by date descending", async () => {
      // Act
      const result = await repository.findAll("desc");

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].title).toBe("Episode 3");
      expect(result[1].title).toBe("Episode 2");
      expect(result[2].title).toBe("Episode 1");
    });

    it("should return limited number of episodes", async () => {
      // Act
      const result = await repository.findAll("asc", 2);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Episode 1");
      expect(result[1].title).toBe("Episode 2");
    });

    it("should return empty array when no episodes exist", async () => {
      // Arrange - clean table
      await TestDatabaseSetup.cleanupEpisodesTable();
      await TestDatabaseSetup.createEpisodesTable();

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe("findFeatured", () => {
    beforeEach(async () => {
      // Add test data with mixed featured/non-featured episodes
      await repository.add(
        Episode.create(
          "Regular Episode 1",
          false,
          new Date("2024-01-01T00:00:00Z"),
        ),
      );
      await repository.add(
        Episode.create(
          "Featured Episode 1",
          true,
          new Date("2024-02-01T00:00:00Z"),
        ),
      );
      await repository.add(
        Episode.create(
          "Regular Episode 2",
          false,
          new Date("2024-03-01T00:00:00Z"),
        ),
      );
      await repository.add(
        Episode.create(
          "Featured Episode 2",
          true,
          new Date("2024-04-01T00:00:00Z"),
        ),
      );
    });

    it("should return only featured episodes", async () => {
      // Act
      const result = await repository.findFeatured();

      // Assert
      expect(result).toHaveLength(2);
      expect(result.every((episode) => episode.featured)).toBe(true);
      expect(result.map((e) => e.title)).toContain("Featured Episode 1");
      expect(result.map((e) => e.title)).toContain("Featured Episode 2");
    });

    it("should return empty array when no featured episodes exist", async () => {
      // Arrange - clean table and add only non-featured episodes
      await TestDatabaseSetup.cleanupEpisodesTable();
      await TestDatabaseSetup.createEpisodesTable();

      await repository.add(
        Episode.create(
          "Regular Episode",
          false,
          new Date("2024-01-01T00:00:00Z"),
        ),
      );

      // Act
      const result = await repository.findFeatured();

      // Assert
      expect(result).toHaveLength(0);
    });
  });
});
