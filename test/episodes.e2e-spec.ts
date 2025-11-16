import "dotenv/config";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { EpisodeDto } from "../src/episodes/dtos/EpisodeDto";

describe("/episodes E2E", () => {
  let app: INestApplication<App>;

  beforeAll(() => {
    process.env.API_KEY = "my-test-api-key";
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("Unauthenticated requests should return 403", async () => {
    const response = await request(app.getHttpServer())
      .get("/episodes")
      .expect(403);

    expect(response.body).not.toBeNull();

    const errorResponse = response.body as {
      message: string;
      statusCode: number;
      error: string;
    };
    expect(errorResponse.message).toBe("Forbidden resource");
    expect(errorResponse.statusCode).toBe(403);
    expect(errorResponse.error).toBe("Forbidden");
  });

  it("GET /episodes should return 200", async () => {
    const response = await request(app.getHttpServer())
      .get("/episodes")
      .set("x-api-key", "my-test-api-key")
      .expect(200);

    expect(response.body).not.toBeNull();
    expect(Array.isArray(response.body)).toBe(true);

    const episodes = response.body as Array<{
      id?: number;
      title: string;
      featured: boolean;
      publishedAt: string;
    }>;

    // Verify it's an array (could be empty initially)
    expect(episodes).toBeInstanceOf(Array);
  });

  it("GET /episodes/featured should return 200", async () => {
    const response = await request(app.getHttpServer())
      .get("/episodes/featured")
      .set("x-api-key", "my-test-api-key")
      .expect(200);

    expect(response.body).not.toBeNull();
    expect(Array.isArray(response.body)).toBe(true);

    const featuredEpisodes = response.body as Array<{
      id?: number;
      title: string;
      featured: boolean;
      publishedAt: string;
    }>;

    // Verify it's an array and if there are episodes, they should be featured
    expect(featuredEpisodes).toBeInstanceOf(Array);
    if (featuredEpisodes.length > 0) {
      featuredEpisodes.forEach((episode) => {
        expect(episode.featured).toBe(true);
      });
    }
  });

  it("GET /episodes/:id should return 200", async () => {
    const episodeDto = new EpisodeDto({
      title: "Episode 1",
      featured: false,
      publishedAt: new Date(),
    });

    await request(app.getHttpServer())
      .post("/episodes")
      .set("x-api-key", "my-test-api-key")
      .send(episodeDto)
      .expect(201);

    return request(app.getHttpServer())
      .get("/episodes/1")
      .set("x-api-key", "my-test-api-key")
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();

        const episode = res.body as { title: string; featured: boolean };
        expect(episode.title).toBe("Episode 1");
        expect(episode.featured).toBe(false);
      });
  });

  it("GET /episodes/:id should return 404 when episode not found", async () => {
    return request(app.getHttpServer())
      .get("/episodes/1")
      .set("x-api-key", "my-test-api-key")
      .expect(404)
      .expect((res) => {
        expect(res.body).not.toBeNull();

        const errorResponse = res.body as {
          message: string;
          statusCode: number;
          error: string;
        };
        expect(errorResponse.message).toBe("Episode not found");
        expect(errorResponse.statusCode).toBe(404);
        expect(errorResponse.error).toBe("Not Found");
      });
  });

  it("POST /episodes successful should return 201", async () => {
    const episodeDto = new EpisodeDto({
      title: "Episode 1",
      featured: false,
      publishedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post("/episodes")
      .set("x-api-key", "my-test-api-key")
      .send(episodeDto)
      .expect(201);

    expect(response.body).not.toBeNull();
  });

  it("POST /episodes with invalid body should return 400", async () => {
    const invalidEpisodeDto = undefined;

    const response = await request(app.getHttpServer())
      .post("/episodes")
      .set("x-api-key", "my-test-api-key")
      .send(invalidEpisodeDto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const errorResponse = response.body as {
      message: string;
      statusCode: number;
      error: string;
    };
    expect(errorResponse.statusCode).toBe(400);
    expect(errorResponse.error).toBe("Bad Request");
    expect(errorResponse.message).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
