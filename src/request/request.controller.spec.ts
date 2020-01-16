import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './request.controller';

describe('Request Controller', () => {
  let controller: RequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
    }).compile();

    controller = module.get<RequestController>(RequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
