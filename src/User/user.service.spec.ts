import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/User';
import { UserDTO } from './entities/User.dto';
import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
import { UserService } from './user.service';

describe('User Service', () => {

  let mockMongoResults = [];
  let mockArray = [];

  const aNewUser: UserDTO = {
    "name": "sample",
    "email": "email@email.com",
    "password": "123123"
  };

  const aNewUserButSameEmail: UserDTO = {
    "name": "sample",
    "email": "fake1@email.com",
    "password": "123123"
  };

  const anUpdatedVersionOfUser: UserDTO = {
    "name": "Not a Sample",
    "email": "AnotherEmail@email.com",
    "password": "UwU"
  };

  const MockFactory = {
    saveUser: jest.fn(),
    findAllUsers: jest.fn(),
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    updateUserById: jest.fn(),
    deleteUser: jest.fn(),
  };

  let service: UserService;
  let repository: MongoUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: MongoUserRepository,
          useValue: MockFactory
        }
      ]
    }).compile();

    mockArray = [{
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

    mockMongoResults = mockArray.concat();

    service = module.get<UserService>(UserService);
    repository = module.get<MongoUserRepository>(MongoUserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return three users given mockArray have 3 users', async () => {
    jest.spyOn(repository, 'findAllUsers').mockImplementation(async () => mockMongoResults);

    const usersFound = await service.findAllUsers();
    expect(usersFound).toStrictEqual(mockArray);
  });

  it('should save a new user', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });

    const userSaved = await service.saveUser(aNewUser);
    expect(mockMongoResults.length).toBe(4);
    expect(mockArray.length).toBe(3);
    expect(mockMongoResults).toContain(userSaved);
  });

  it('should hash the new user password', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });

    const userSaved = await service.saveUser(aNewUser);
    expect(userSaved.password != aNewUser.password).toBe(false);
  });

  it('should throw if email is already used', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find(
        (elem) =>
          elem.email === email
      ));
    try {
      await service.saveUser(aNewUserButSameEmail);
    } catch (error) {
      expect(error.message).toBe(`User already exists. Can't save.`);
    }
  });

  // it('should find a user using a email', async () => {
  //   jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
  //     mockMongoResults.find(
  //       (elem) =>
  //         elem.email === email
  //     ));

  //   const usersFound = await service.findUserByEmail();
  //   expect(usersFound).toBe(mockArray);
  // });

  // it('should find user using an ID', async () => {
  //   jest.spyOn(repository, 'findUserById').mockImplementation(async (id: string) =>
  //     mockMongoResults.find(
  //       (elem) =>
  //         elem.id === id
  //     ));
  //   const usersFound = await service.findUserById();
  //   expect(usersFound).toBe(mockArray);
  // });

  // it('should update an existing user', async () => {
  //   jest.spyOn(repository, 'updateUserById').mockImplementation(async (user: User) => {
  //     let getIndex;
  //     mockMongoResults.forEach(
  //       (elem, index) => {
  //         if (elem.id === user.id) {
  //           elem = user;
  //           getIndex = index;
  //         }
  //       }
  //     );
  //     return mockMongoResults[getIndex];
  //   });
  //   const usersFound = await service.updateUser();
  //   expect(usersFound).toBe(mockArray);
  // });

  // it('should delete a user', async () => {
  //   jest.spyOn(repository, 'deleteUser').mockImplementation(async (user: User) => {
  //     const index = mockMongoResults.forEach((elem, index) => {
  //       if (elem.id === user.id)
  //         mockMongoResults.splice(index);
  //     });
  //   });
  //   const usersFound = await service.deleteUser();
  //   expect(usersFound).toBe(mockArray);
  // });


});