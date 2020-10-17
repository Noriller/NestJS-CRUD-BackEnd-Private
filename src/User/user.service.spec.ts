import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/User';
import { UserDTO } from './entities/User.dto';
import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
import { UserService } from './user.service';

describe('User Service', () => {

  let mockMongoResults: User[] = [];
  let mockArrayTemplate: User[] = [];
  let aNewUserTemplate: UserDTO;
  let aNewUserButSameEmailTemplate: UserDTO;
  let anUpdatedVersionOfUserTemplate: UserDTO;

  const MockFactory = {
    saveUser: jest.fn(),
    findAllUsers: jest.fn(),
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    updateUserById: jest.fn(),
    deleteUserById: jest.fn(),
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

    mockArrayTemplate = [{
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

    aNewUserTemplate = {
      "name": "sample",
      "email": "email@email.com",
      "password": "123123"
    };

    aNewUserButSameEmailTemplate = {
      "name": "sample",
      "email": "fake1@email.com",
      "password": "123123"
    };

    anUpdatedVersionOfUserTemplate = {
      "name": "Not a Sample",
      "email": "AnotherEmail@email.com",
      "password": "UwU"
    };

    mockMongoResults = mockArrayTemplate.concat();

    service = module.get<UserService>(UserService);
    repository = module.get<MongoUserRepository>(MongoUserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return three users given mockArray have 3 users', async () => {
    jest.spyOn(repository, 'findAllUsers').mockImplementation(async () => mockMongoResults);

    const usersFound = await service.findAllUsers();
    expect(usersFound).toStrictEqual(mockArrayTemplate);
  });

  it('should return empty array if not found anything', async () => {
    jest.spyOn(repository, 'findAllUsers').mockImplementation(async () => []);

    const usersFound = await service.findAllUsers();
    expect(usersFound).toStrictEqual([]);
  });

  it('should save a new user', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    const userSaved = await service.saveUser(aNewUser);
    expect(mockMongoResults.length).toBe(4);
    expect(mockArrayTemplate.length).toBe(3);
    expect(mockMongoResults).toContain(userSaved);
  });

  it('should throw if not passing a name', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    aNewUser.name = '';
    try {
      const userSaved = await service.saveUser(aNewUser);
    } catch (error) {
      expect(error.message).toBe(`Name is required.`);
    }
  });

  it('should throw if not passing a email', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    aNewUser.email = '';
    try {
      const userSaved = await service.saveUser(aNewUser);
    } catch (error) {
      expect(error.message).toBe(`Email is required.`);
    }
  });

  it('should throw if not passing a password', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    aNewUser.password = '';
    try {
      const userSaved = await service.saveUser(aNewUser);
    } catch (error) {
      expect(error.message).toBe(`Password is required.`);
    }
  });

  it('should throw if failed to save', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      return null;
    });

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    try {
      const userSaved = await service.saveUser(aNewUser);
    } catch (error) {
      expect(error.message).toBe(`Failed to save user.`);
    }
  });

  it('should save the new user data', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    const userSaved = await service.saveUser(aNewUser);

    expect(userSaved.email).toBe(aNewUserTemplate.email);
    expect(userSaved.name).toBe(aNewUserTemplate.name);
  });

  it('should hash the new user password', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    const userSaved = await service.saveUser(aNewUser);
    expect(userSaved.password).not.toBe(aNewUserTemplate.password);
  });

  it('should throw if email is already used', async () => {
    jest.spyOn(repository, 'saveUser').mockImplementation(async (user: User) => {
      mockMongoResults.push(user);
      return user;
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const aNewUserButSameEmail: UserDTO = { ...aNewUserButSameEmailTemplate };
    try {
      await service.saveUser(aNewUserButSameEmail);
    } catch (error) {
      expect(error.message).toBe(`User already exists. Can't save.`);
    }
  });

  it('should find a user using a email', async () => {
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const lookupMock: UserDTO = { ...mockArrayTemplate[0] };

    const userFound = await service.findUserByEmail(lookupMock.email);
    const comparation = JSON.stringify(userFound) == JSON.stringify(lookupMock);
    expect(comparation).toBe(true);
  });

  it('should throw error when not passing a email', async () => {
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    try {
      await service.findUserByEmail(null);
    } catch (error) {
      expect(error.message).toBe(`Email cannot be empty.`);
    }
  });

  it('should throw error when a user is not found', async () => {
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    try {
      await service.findUserByEmail('notInDatabase@email.com');
    } catch (error) {
      expect(error.message).toBe(`User not found.`);
    }
  });

  it('should update an existing user', async () => {
    jest.spyOn(repository, 'updateUserById').mockImplementation(async (user: User) => {
      const index = mockMongoResults.findIndex((elem => elem.id == user.id));
      mockMongoResults[index] = user;
      return mockMongoResults[index];
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    const userUpdated = await service.updateUser(mockMongoResults[0].email, anUpdatedVersionOfUser);
    expect(mockMongoResults).toContain(userUpdated);
  });

  it('should update an existing user while passing an id', async () => {
    jest.spyOn(repository, 'updateUserById').mockImplementation(async (user: User) => {
      const index = mockMongoResults.findIndex((elem => elem.id == user.id));
      mockMongoResults[index] = user;
      return mockMongoResults[index];
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    anUpdatedVersionOfUser.id = mockMongoResults[0].id;

    const userUpdated = await service.updateUser(mockMongoResults[0].email, anUpdatedVersionOfUser);
    expect(mockMongoResults).toContain(userUpdated);
  });

  it('should throw if not passing originalEmail', async () => {
    jest.spyOn(repository, 'updateUserById').mockImplementation(async (user: User) => {
      const index = mockMongoResults.findIndex((elem => elem.id == user.id));
      mockMongoResults[index] = user;
      return mockMongoResults[index];
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    try {
      const userUpdated = await service.updateUser('', anUpdatedVersionOfUser);
    } catch (error) {
      expect(error.message).toBe('Must provide original email.');
    }
  });

  it('should throw on error while updating', async () => {
    jest.spyOn(repository, 'updateUserById').mockImplementation(async (user: User) => {
      return null;
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    try {
      const userUpdated = await service.updateUser(mockMongoResults[0].email, anUpdatedVersionOfUser);
    } catch (error) {
      expect(error.message).toBe('Server Error while saving data.');
    }
  });

  it('should give the updated version of the user', async () => {
    jest.spyOn(repository, 'updateUserById').mockImplementation(async (user: User) => {
      const index = mockMongoResults.findIndex((elem => elem.id == user.id));
      mockMongoResults[index] = user;
      return mockMongoResults[index];
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    const userUpdated = await service.updateUser(mockMongoResults[0].email, anUpdatedVersionOfUser);

    expect(userUpdated.email).toBe(anUpdatedVersionOfUserTemplate.email);
    expect(userUpdated.name).toBe(anUpdatedVersionOfUserTemplate.name);
    expect(userUpdated.id).not.toBe(anUpdatedVersionOfUserTemplate.id);
  });

  it('should encrypt the password while updating', async () => {
    jest.spyOn(repository, 'updateUserById').mockImplementation(async (user: User) => {
      const index = mockMongoResults.findIndex((elem => elem.id == user.id));
      mockMongoResults[index] = user;
      return mockMongoResults[index];
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    const userUpdated = await service.updateUser(mockMongoResults[0].email, anUpdatedVersionOfUser);
    expect(anUpdatedVersionOfUserTemplate.password).not.toBe(userUpdated.password);
  });

  it('should delete a user', async () => {
    jest.spyOn(repository, 'deleteUserById').mockImplementation(async (id: string) => {
      const index = mockMongoResults.findIndex((elem => elem.id == id));
      const deleted = { ...mockMongoResults[index] };
      mockMongoResults.splice(index, 1);
      return deleted;
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const userToDelete: UserDTO = { ...mockMongoResults[1] };
    const deletedUser = await service.deleteUser(userToDelete.email);
    expect(mockMongoResults).not.toContain(deletedUser);
    expect(mockMongoResults.length).toBe(2);
    expect(mockArrayTemplate.length).toBe(3);
  });

  it('should throw if not passing an email', async () => {
    jest.spyOn(repository, 'deleteUserById').mockImplementation(async (id: string) => {
      const index = mockMongoResults.findIndex((elem => elem.id == id));
      const deleted = { ...mockMongoResults[index] };
      mockMongoResults.splice(index, 1);
      return deleted;
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const userToDelete: UserDTO = { ...mockMongoResults[1] };
    userToDelete.email = '';
    try {
      const deletedUser = await service.deleteUser(userToDelete.email);
    } catch (error) {
      expect(error.message).toBe('Email cannot be empty.');
    }
  });

  it('should throw if user could not be deleted', async () => {
    jest.spyOn(repository, 'deleteUserById').mockImplementation(async (id: string) => {
      return null;
    });
    jest.spyOn(repository, 'findUserByEmail').mockImplementation(async (email: string) =>
      mockMongoResults.find((elem) => elem.email === email));

    const userToDelete: UserDTO = { ...mockMongoResults[1] };
    try {
      const deletedUser = await service.deleteUser(userToDelete.email);
    } catch (error) {
      expect(error.message).toBe('User could not be deleted.');
    }
  });


});