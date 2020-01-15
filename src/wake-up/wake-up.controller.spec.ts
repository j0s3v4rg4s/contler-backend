import { Test, TestingModule } from '@nestjs/testing';
import { WakeUpController } from './wake-up.controller';

describe('WakeUp Controller', () => {
  let controller: WakeUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WakeUpController],
    }).compile();

    controller = module.get<WakeUpController>(WakeUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
