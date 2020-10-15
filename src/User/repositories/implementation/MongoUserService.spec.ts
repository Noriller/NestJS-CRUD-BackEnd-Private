import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoUserService } from './MongoUserService';

describe('Mongo User Repository', () => {
  let service: MongoUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoUserService, {
        provide: getModelToken('User'),
        useValue: MongoUserService
      }]
    }).compile();

    service = module.get<MongoUserService>(MongoUserService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
