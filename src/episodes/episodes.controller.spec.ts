import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { IEpisodesService } from './interfaces/IEpisodesService';
import { Episode } from './entities/Episode';
import { ConfigModule } from '../config/config.module';
import { IsPositivePipe } from '../pipes/is-positive/is-positive.pipe';

describe('EpisodesController', () => {
  let controller: EpisodesController;
  let mockEpisodesService: jest.Mocked<IEpisodesService>;

  beforeEach(async () => {
    const episodes : Episode[] = [
      { id: 1, title: 'Episode 1', featured: false },
      { id: 2, title: 'Episode 2', featured: true },
      { id: 3, title: 'Episode 3', featured: false },
      { id: 4, title: 'Episode 4', featured: true },
    ];

    mockEpisodesService = {
      findAll: jest.fn().mockReturnValue(episodes),
      findFeatured: jest.fn().mockReturnValue(episodes.filter(e => e.featured)),
      findById: jest.fn().mockReturnValue(episodes[0]),
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [EpisodesController],
      providers: [
        { provide: EpisodesService, useValue: mockEpisodesService },
        IsPositivePipe
      ],
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
  });

  describe('GET endpoints', () => {
    it('should return all episodes in ascending order by default', async () => {
      const noLimit = undefined;
      const result = await controller.findAll(noLimit);
      
      expect(result).toBeDefined();
      expect(result).toHaveLength(4);
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('asc', noLimit);
    });

    it('should return all episodes in ascending order when sort param is "asc"', async () => {
      const noLimit = undefined;
      const result = await controller.findAll(noLimit, 'asc');
      
      expect(result).toBeDefined();
      expect(result).toHaveLength(4);
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('asc', noLimit);
    });

    it('should return all episodes in descending order when sort param is "desc"', async () => {
      const noLimit = undefined;
      const result = await controller.findAll(noLimit, 'desc');

      expect(result).toBeDefined();
      expect(result).toHaveLength(4);
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('desc', noLimit);
    });

    it('should return all episodes in ascending order when sort param is invalid', async () => {
      const noLimit = undefined;
      const result = await controller.findAll(noLimit, 'invalid' as any);

      expect(result).toBeDefined();
      expect(result).toHaveLength(4);
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('invalid', noLimit);
    });

    it('should return featured episodes', async () => {
      const result = await controller.findFeatured();
      
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(mockEpisodesService.findFeatured).toHaveBeenCalledTimes(1);
    });

    it('should return episode by id', async () => {
      const result = await controller.findById(1);
      
      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(mockEpisodesService.findById).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw an error for non-existing episode id', async () => {
      
      mockEpisodesService.findById.mockReturnValueOnce(Promise.resolve(undefined));

      const invalidId = -1;
      
      await expect(controller.findById(invalidId)).rejects.toThrow('Episode not found');
      expect(mockEpisodesService.findById).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findById).toHaveBeenCalledWith(invalidId);
    });

  });

  describe('POST endpoint', () => {
    it('should create a new episode', async () => {
      const newEpisode = new Episode(5, 'Episode 5', false);

      await controller.create(newEpisode);
      
      expect(mockEpisodesService.add).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.add).toHaveBeenCalledWith(newEpisode);
    });
  });
});