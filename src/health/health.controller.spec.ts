import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });
  const expectedResponse = {
    status: 'ok',
    timestamp: expect.any(String),
    version: process.env.npm_package_version || 'unknown',
  };
  it('should status OK and NPM version', () => {
    expect(controller.health()).toEqual(expectedResponse);
  });
});
