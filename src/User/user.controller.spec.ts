﻿// import { getModelToken, InjectModel } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
// import { Model } from 'mongoose';
// import { UserDocument } from './entities/User.schema';
// import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
// import { IUserService } from './repositories/IUserService';
// import { UserController } from './user.controller';

// describe('UserController', () => {
//   let controller: UserController;

//   let mockMongoResults = [];

//   const MockMongoFactory = jest.fn(
//     () => {
//       saveUser: (user: UserDocument) => mockMongoResults.push(user);
//       findallUsers: () => mockMongoResults;
//       findUserById: (id: string) => mockMongoResults.find((elem) => elem._id === id);
//       findUserByEmail: (email: string) => mockMongoResults.find((elem) => elem.email === email);
//       updateUser: (user: UserDocument) => mockMongoResults.find((elem) => {
//         if (elem._id === user._id)
//           elem = user;
//       });
//       deleteUser: (user: UserDocument) => {
//         const index = mockMongoResults.forEach((elem, index) => {
//           if (elem._id === user._id)
//             mockMongoResults.splice(index);
//         });
//       };
//     }
//   );

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [MongoUserRepository, {
//         provide: getModelToken('User'),
//         useFactory: MockMongoFactory
//       }]
//     }).compile();

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

//     controller = module.get<UserController>(UserController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   // it('should find 3 users', async () => {
//   //   expect(await controller.getAllUsers()).toEqual(mockMongoResults);
//   // });
// });

it('should ', () => {
  return;
});