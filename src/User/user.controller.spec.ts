import { getModelToken, InjectModel } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoUserService } from './repositories/implementation/MongoUserService';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [MongoUserService, {
        provide: getModelToken('User'),
        useValue: MongoUserService
      }]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});