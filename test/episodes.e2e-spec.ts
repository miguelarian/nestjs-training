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
    return await request(app.getHttpServer())
      .get("/episodes")
      .expect(403)
      .expect((res) => {
        expect(res.body).not.toBeNull();
        expect(res.body.message).toBe("Forbidden resource");
        expect(res.body.statusCode).toBe(403);
        expect(res.body.error).toBe("Forbidden");
      });
  });

  it("GET /episodes should return 200", async () => {
    return await request(app.getHttpServer())
      .get("/episodes")
      .set("x-api-key", "my-test-api-key")
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  it("GET /episodes/featured should return 200", async () => {
    return await request(app.getHttpServer())
      .get("/episodes/featured")
      .set("x-api-key", "my-test-api-key")
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
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

    return await request(app.getHttpServer())
      .get("/episodes/1")
      .set("x-api-key", "my-test-api-key")
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  it("GET /episodes/:id should return 404 when episode not found", async () => {
    return await request(app.getHttpServer())
      .get("/episodes/1")
      .set("x-api-key", "my-test-api-key")
      .expect(404)
      .expect((res) => {
        expect(res.body).not.toBeNull();
        expect(res.body.message).toBe("Episode not found");
        expect(res.body.statusCode).toBe(404);
        expect(res.body.error).toBe("Not Found");
      });
  });

  it("POST /episodes successful should return 201", async () => {
    const episodeDto = new EpisodeDto({
      title: "Episode 1",
      featured: false,
      publishedAt: new Date(),
    });

    return await request(app.getHttpServer())
      .post("/episodes")
      .set("x-api-key", "my-test-api-key")
      .send(episodeDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  it("POST /episodes with invalid body should return 400", async () => {
    const invalidEpisodeDto = undefined;

    return await request(app.getHttpServer())
      .post("/episodes")
      .set("x-api-key", "my-test-api-key")
      .send(invalidEpisodeDto)
      .expect(400)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
