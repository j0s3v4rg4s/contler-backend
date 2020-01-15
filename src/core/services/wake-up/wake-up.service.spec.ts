import { Test, TestingModule } from '@nestjs/testing';
import { WakeUpService } from './wake-up.service';

describe('WakeUpService', () => {
  let service: WakeUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WakeUpService],
    }).compile();

    service = module.get<WakeUpService>(WakeUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
