import { Test, TestingModule } from '@nestjs/testing';
import { TrackPlaylistController } from './track-playlist.controller';

describe('TrackPlaylistController', () => {
  let controller: TrackPlaylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackPlaylistController],
    }).compile();

    controller = module.get<TrackPlaylistController>(TrackPlaylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
