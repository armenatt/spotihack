import { Test, TestingModule } from '@nestjs/testing';
import { WsUsersService } from './ws-users.service';

describe('WsUsersService', () => {
  let service: WsUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsUsersService],
    }).compile();

    service = module.get<WsUsersService>(WsUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
