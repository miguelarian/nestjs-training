import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Episode } from '../src/episodes/entities/Episode';

describe('/episodes E2E', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /episodes should return 200', async () => {
    return await request(app.getHttpServer())
      .get('/episodes')
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  it('GET /episodes/featured should return 200', async () => {
    return await request(app.getHttpServer())
      .get('/episodes/featured')
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  it('GET /episodes/:id should return 200', async () => {

    const episode = new Episode(1, 'Episode 1', false);

    await request(app.getHttpServer())
      .post('/episodes')
      .send(episode)
      .expect(201);

    return await request(app.getHttpServer())
      .get('/episodes/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  it('GET /episodes/:id should return 404 when episode not found', async () => {
    return await request(app.getHttpServer())
      .get('/episodes/1')
      .expect(404)
      .expect((res) => {
        expect(res.body).not.toBeNull();
        expect(res.body.message).toBe('Episode not found');
        expect(res.body.statusCode).toBe(404);
        expect(res.body.error).toBe('Not Found');
      });
  });

  it('POST /episodes should return 201', async () => {
    return await request(app.getHttpServer())
      .post('/episodes')
      .expect(201)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  }); 

  afterAll(async () => {
    await app.close();
  });
});
