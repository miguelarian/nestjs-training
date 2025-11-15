import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesService } from './episodes.service';
import { ConfigService } from '../config/config.service';

describe('EpisodesService', () => {
  let service: EpisodesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpisodesService, ConfigService],
    }).compile();

    service = module.get<EpisodesService>(EpisodesService);

    service.add({ id: 1, title: 'Episode 1', featured: false });
    service.add({ id: 2, title: 'Episode 2', featured: true });
    service.add({ id: 3, title: 'Episode 3', featured: false });
    service.add({ id: 4, title: 'Episode 4', featured: true });
  });

  it('findAll should return all episodes in ascending order by default', () => {
    const result = service.findAll();
    expect(result[0].id).toBeLessThan(result[1].id);
    expect(result[1].id).toBeLessThan(result[2].id);
    expect(result[2].id).toBeLessThan(result[3].id);
  });

  it('should return undefined when no episodes exist for a invalid ID', () => {
    const nonExistingId = -1;
    const episode = service.findById(nonExistingId);
    expect(episode).toBeUndefined();
  });

  it('findById should return the correct episode for a valid ID', () => {
    const existingId = 1;
    const episode = service.findById(existingId);
    expect(episode).toBeDefined();
    expect(episode?.id).toBe(existingId);
    expect(episode?.title).toBe('Episode 1');
  });

});
