import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesController } from './episodes.controller';

describe('EpisodesController', () => {
  let controller: EpisodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodesController],
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
  });

  describe('GET endpoints', () => {
    it('shoud return all epidodes in ascending order by default', () => {
      expect(controller.findAll())
        .toBe('This action returns all episodes in ascending order');
    });

    it('shoud return all epidodes in ascending order', () => {
      expect(controller.findAll('asc'))
        .toBe('This action returns all episodes in ascending order');
    });

    it('shoud return all epidodes in descending order', () => {
      expect(controller.findAll('desc'))
        .toBe('This action returns all episodes in descending order');
    });

    it('shoud return all epidodes in ascending order when sort param is invalid', () => {
      expect(controller.findAll('invalid' as any))
        .toBe('This action returns all episodes in ascending order');
    });

    it('shoud return featured episodes', () => {
      expect(controller.findFeatured())
        .toBe('This action returns featured episodes');
    });
  });

});
