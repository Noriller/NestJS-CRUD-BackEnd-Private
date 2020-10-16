import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/User';
import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
import { UserService } from './user.service';

describe('User Service', () => {

  let mockMongoResults = [];

  const mockArray = [{
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

  const MockFactory = {
    saveUser: jest.fn().mockImplementation(
      (user: User) => {
        mockMongoResults.push(user);
        return user;
      }),
    findAllUsers: jest.fn().mockImplementation(
      () => {
        console.log('oi');
        return mockMongoResults;
      }
    ),
    findUserByEmail: jest.fn().mockImplementation(
      (email: string) =>
        mockMongoResults.find(
          (elem) =>
            elem.email === email
        )
    ),
    findUserById: jest.fn().mockImplementation(
      (id: string) =>
        mockMongoResults.find(
          (elem) =>
            elem.id === id
        )
    ),
    updateUserById: jest.fn().mockImplementation(
      (user: User) => {
        let getIndex;
        mockMongoResults.forEach(
          (elem, index) => {
            if (elem.id === user.id) {
              elem = user;
              getIndex = index;
            }
          }
        );
        return mockMongoResults[getIndex];
      }
    ),
    deleteUser: jest.fn().mockImplementation(
      (user: User) => {
        const index = mockMongoResults.forEach((elem, index) => {
          if (elem.id === user.id)
            mockMongoResults.splice(index);
        });
      })
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

    mockMongoResults = mockArray;

    service = module.get<UserService>(UserService);
    repository = module.get<MongoUserRepository>(MongoUserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return three users', async () => {
    jest.spyOn(repository, 'findAllUsers').mockImplementation(MockFactory.findAllUsers);
    const usersFound = await service.findAllUsers();
    expect(usersFound).toBe(mockArray);
  });

});