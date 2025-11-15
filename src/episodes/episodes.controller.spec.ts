import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { IEpisodesService } from './interfaces/IEpisodesService';
import { Episode } from './entities/Episode';
import { ConfigModule } from '../config/config.module';

describe('EpisodesController', () => {
  let controller: EpisodesController;
  let mockEpisodesService: IEpisodesService;

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
    } as jest.Mocked<IEpisodesService>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [EpisodesController],
      providers: [
        { provide: EpisodesService, useValue: mockEpisodesService }
      ],
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
  });

  describe('GET endpoints', () => {
    it('should return all episodes in ascending order by default', () => {
      const result = controller.findAll();
      
      expect(result).toBeDefined();
      expect(result).toHaveLength(4);
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('asc');
    });

    it('should return all episodes in ascending order when sort param is "asc"', () => {
      const result = controller.findAll('asc');
      
      expect(result).toBeDefined();
      expect(result).toHaveLength(4);
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('asc');
    });

    it('should return all episodes in descending order when sort param is "desc"', () => {
      const result = controller.findAll('desc');

      expect(result).toBeDefined();
      expect(result).toHaveLength(4);
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('desc');
    });

    it('should return all episodes in ascending order when sort param is invalid', () => {
      const result = controller.findAll('invalid' as any);

      expect(result).toBeDefined();
      expect(result).toHaveLength(4);
      expect(mockEpisodesService.findAll).toHaveBeenCalledTimes(1);
      expect(mockEpisodesService.findAll).toHaveBeenCalledWith('invalid');
    });

    it('should return featured episodes', () => {
      const result = controller.findFeatured();
      
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
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