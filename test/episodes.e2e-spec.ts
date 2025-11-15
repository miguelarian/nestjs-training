import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('/episodes E2E', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /episodes should return 200', () => {
    return request(app.getHttpServer())
      .get('/episodes')
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  it('GET /episodes/featured should return 200', () => {
    return request(app.getHttpServer())
      .get('/episodes/featured')
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  it('GET /episodes/:id should return 200', () => {
    return request(app.getHttpServer())
      .get('/episodes/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).not.toBeNull();
      });
  });

  it('POST /episodes should return 201', () => {
    return request(app.getHttpServer())
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
