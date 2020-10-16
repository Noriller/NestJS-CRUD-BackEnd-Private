import { Inject } from '@nestjs/common';
import { getModelToken, InjectModel } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserDocument, UserSchema } from '../../entities/User.schema';
import { IUserServiceImplementation } from '../UserInterfaces';
import { MongoUserRepository } from './MongoUserRepository';

describe('Mongo User Repository', () => {

  let service: MongoUserRepository;

  let mockMongoResults = [];

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoUserRepository, {
        provide: getModelToken('User'),
        useValue: {}
      }],
    }).compile();

    mockMongoResults = [{
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

    service = module.get<MongoUserRepository>(MongoUserRepository);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should find users', async () => {
  //   expect(await service.findAllUsers()).toBe(mockMongoResults);
  // });


});


// class mockServiceFactory {

//   constructor(
//     mockMongoResults
//   ) {
//     mockMongoResults = [{
//       "_id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
//       "name": "FirstFake",
//       "email": "fake1@email.com",
//       "password": "123123",
//     }, {
//       "_id": "1718fc5c-48b6-4fd7-84ff-bc0fb639a178",
//       "name": "SecondFake",
//       "email": "fake2@email.com",
//       "password": "123123",
//     }, {
//       "_id": "19ef970c-66df-4282-9f53-3a0459093126",
//       "name": "LastFake",
//       "email": "fake3@email.com",
//       "password": "123123",
//     }];

//   }


//   static saveUser = (user: User) => mockMongoResults.push(user);
//   static findallUsers: () => mockMongoResults;
//   static findUserById: (id: string) => mockMongoResults.find((elem) => elem._id === id);
//   static findUserByEmail: (email: string) => mockMongoResults.find((elem) => elem.email === email);
//   static updateUser: (user: User) => mockMongoResults.find((elem) => {
//     if (elem._id === user._id)
//       elem = user;
//   });
//   static deleteUser: (user: User) => {
//   mockMongoResults.forEach((elem, index) => {
//     if (elem._id === user._id)
//       mockMongoResults.splice(index);
//   });
// }
// }
