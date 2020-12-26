﻿import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserDocument } from '../../entities/User.schema';
import { MongoUserRepository } from './MongoUserRepository';

describe('Mongo User Service', () => {
  let service: MongoUserRepository;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoUserRepository,
        {
          provide: getModelToken( 'User' ),
          useValue: mockUseValue,
        },
      ],
    }).compile();

    service = module.get<MongoUserRepository>(MongoUserRepository);
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return mockArray', async () => {
    jest.spyOn(model, 'find').mockReturnValue(jestMockResolvedValue_Exec(mockArrayMongo));
    const mocks = await service.findAllUsers();
    expect(mocks).toEqual(mockArrayUser);
  });

  it('should find one by id', async () => {
    jest.spyOn(model, 'findById').mockReturnValue(jestMockResolvedValue_Exec(mockMongoFormat));
    const foundMock = await service.findUserById(mockUserFormat.id);
    expect(foundMock).toEqual(mockUserFormat);
  });

  it('should return null if user is not found', async () => {
    jest.spyOn(model, 'findById').mockReturnValue(jestMockResolvedValue_Exec(null));
    const foundMock = await service.findUserById(mockUserFormat.id);
    expect(foundMock).toEqual(null);
  });

  it('should find one by email', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue(jestMockResolvedValue_Exec(mockMongoFormat));
    const foundMock = await service.findUserByEmail(mockUserFormat.email);
    expect(foundMock).toEqual(mockUserFormat);
  });

  it( 'should save new user', async () => {
    jest.spyOn( model, 'create' ).mockImplementation(
      jest.fn().mockResolvedValueOnce( mockMongoFormat )
    );
    const foundMock = await service.saveUser( mockUserFormat );
    expect( foundMock ).toEqual( mockUserFormat );
  } );

  it('should find one by id and update', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValue(jestMockResolvedValue_Exec(mockMongoFormat));
    const foundMock = await service.updateUserById(mockUserFormat);
    expect(foundMock).toEqual(mockUserFormat);
  });

  it('should find one by id and delete', async () => {
    jest.spyOn(model, 'findOneAndDelete').mockReturnValue(jestMockResolvedValue_Exec(mockMongoFormat));
    const foundMock = await service.deleteUserById(mockUserFormat.id);
    expect(foundMock).toEqual(mockUserFormat);
  } );
  
});

const mockUseValue = {
  new: jest.fn(),
  constructor: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  exec: jest.fn(),
};

function jestMockResolvedValue_Exec(valueToReturn) {
  return {
    exec: jest.fn().mockResolvedValueOnce(valueToReturn),
  } as any;
}
function jestMockResolvedValue_Create ( valueToReturn ) {
  return {
    create: jest.fn().mockResolvedValueOnce( valueToReturn ),
  } as any;
}

const mockUserFormat = {
  "id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
  "name": "FirstFake",
  "email": "fake1@email.com",
  "password": "123123",
};
const mockMongoFormat = {
  "_id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
  "name": "FirstFake",
  "email": "fake1@email.com",
  "password": "123123",
};

const mockArrayMongo = [{
  "_id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
  "name": "FirstFake",
  "email": "fake1@email.com",
  "password": "123123",
}, {
  "_id": "1718fc5c-48b6-4fd7-84ff-bc0fb639a178",
  "name": "SecondFake",
  "email": "fake2@email.com",
  "password": "123123",
}, {
  "_id": "19ef970c-66df-4282-9f53-3a0459093126",
  "name": "LastFake",
  "email": "fake3@email.com",
  "password": "123123",
}];

const mockArrayUser = [{
  "id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
  "name": "FirstFake",
  "email": "fake1@email.com",
  "password": "123123",
}, {
  "id": "1718fc5c-48b6-4fd7-84ff-bc0fb639a178",
  "name": "SecondFake",
  "email": "fake2@email.com",
  "password": "123123",
}, {
  "id": "19ef970c-66df-4282-9f53-3a0459093126",
  "name": "LastFake",
  "email": "fake3@email.com",
  "password": "123123",
}];