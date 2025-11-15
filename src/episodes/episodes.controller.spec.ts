import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { IEpisodesService } from './interfaces/IEpisodesService';
import { Episode } from './entities/Episode';

describe('EpisodesController', () => {
  let controller: EpisodesController;
  let mockEpisodesService: IEpisodesService;

  beforeEach(async () => {
    mockEpisodesService = {
      findAll: jest.fn(),
      findFeatured: jest.fn(),
      findById: jest.fn(),
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodesController],
      providers: [{ provide: EpisodesService, useValue: mockEpisodesService }],
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
  });

  describe('GET endpoints', () => {
    it('should return all episodes in ascending order by default', () => {
      controller.findAll();
      
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('asc');
    });

    it('should return all episodes in ascending order when sort param is "asc"', () => {
      controller.findAll('asc');
      
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('asc');
    });

    it('should return all episodes in descending order when sort param is "desc"', () => {
      controller.findAll('desc');

      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('desc');
    });

    it('should return all episodes in ascending order when sort param is invalid', () => {
      controller.findAll('invalid' as any);
      
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('invalid');
    });

    it('should return featured episodes', () => {
      controller.findFeatured();
      
      expect(mockEpisodesService.findFeatured).toHaveBeenCalledTimes(1);
    });

  });

  describe('POST endpoint', () => {
    it('should create a new episode', () => {
      const newEpisode = new Episode(5, 'Episode 5', false);

      controller.create(newEpisode);
      
      expect(mockEpisodesService.add).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.add).toHaveBeenCalledWith(newEpisode);
    });
  });
});