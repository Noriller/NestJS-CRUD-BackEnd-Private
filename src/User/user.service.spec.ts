import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/User';
import { UserDTO } from './entities/User.dto';
import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
import { UserService } from './user.service';

describe( 'User Service', () => {

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

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule( {
      providers: [
        UserService,
        {
          provide: MongoUserRepository,
          useValue: MockFactory
        }
      ]
    } ).compile();

    mockArrayTemplate = [ new User( {
      "_id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
      "_name": "FirstFake",
      "_email": "fake1@email.com",
      "_password": "123123",
    } ), new User( {
      "_id": "1718fc5c-48b6-4fd7-84ff-bc0fb639a178",
      "_name": "SecondFake",
      "_email": "fake2@email.com",
      "_password": "123123",
    } ), new User( {
      "_id": "19ef970c-66df-4282-9f53-3a0459093126",
      "_name": "LastFake",
      "_email": "fake3@email.com",
      "_password": "123123",
    } ) ];

    aNewUserTemplate = {
      "_name": "sample",
      "_email": "email@email.com",
      "_password": "123123"
    };

    aNewUserButSameEmailTemplate = {
      "_name": "sample",
      "_email": "fake1@email.com",
      "_password": "123123"
    };

    anUpdatedVersionOfUserTemplate = {
      "_name": "Not a Sample",
      "_email": "AnotherEmail@email.com",
      "_password": "UwU"
    };

    mockMongoResults = mockArrayTemplate.concat();

    service = module.get<UserService>( UserService );
    repository = module.get<MongoUserRepository>( MongoUserRepository );
  } );

  it( 'should be defined', () => {
    expect( service ).toBeDefined();
  } );

  it( 'should return three users given mockArray have 3 users', async () => {
    jest.spyOn( repository, 'findAllUsers' ).mockImplementation( async () => mockMongoResults );

    const usersFound = await service.findAllUsers();
    expect( usersFound ).toStrictEqual( mockArrayTemplate );
  } );

  it( 'should return empty array if not found anything', async () => {
    jest.spyOn( repository, 'findAllUsers' ).mockImplementation( async () => [] );

    const usersFound = await service.findAllUsers();
    expect( usersFound ).toStrictEqual( [] );
  } );

  it( 'should save a new user', async () => {
    jest.spyOn( repository, 'saveUser' ).mockImplementation( jestMockImplementation_SaveUser( mockMongoResults ) );

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    const userSaved = await service.saveUser( aNewUser );
    expect( mockMongoResults.length ).toBe( 4 );
    expect( mockArrayTemplate.length ).toBe( 3 );
    expect( mockMongoResults ).toContain( userSaved );
  } );

  it( 'should throw if not passing a name while saving', async () => {
    jest.spyOn( repository, 'saveUser' ).mockImplementation( jestMockImplementation_SaveUser( mockMongoResults ) );

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    aNewUser._name = '';
    try {
      const userSaved = await service.saveUser( aNewUser );
      expect( userSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Name is required.` );
    }
  } );

  it( 'should throw if not passing a email while saving', async () => {
    jest.spyOn( repository, 'saveUser' ).mockImplementation( jestMockImplementation_SaveUser( mockMongoResults ) );

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    aNewUser._email = '';
    try {
      const userSaved = await service.saveUser( aNewUser );
      expect( userSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Email is required.` );
    }
  } );

  it( 'should throw if not passing a password while saving', async () => {
    jest.spyOn( repository, 'saveUser' ).mockImplementation( jestMockImplementation_SaveUser( mockMongoResults ) );

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    aNewUser._password = '';
    try {
      const userSaved = await service.saveUser( aNewUser );
      expect( userSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Password is required.` );
    }
  } );

  it( 'should throw if failed to save', async () => {
    jest.spyOn( repository, 'saveUser' ).mockImplementation( async ( user: User ) => null );

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    try {
      const userSaved = await service.saveUser( aNewUser );
      expect( userSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Failed to save user.` );
    }
  } );

  it( 'should save the new user data', async () => {
    jest.spyOn( repository, 'saveUser' ).mockImplementation( jestMockImplementation_SaveUser( mockMongoResults ) );

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    const userSaved = await service.saveUser( aNewUser );

    expect( userSaved.email() ).toBe( aNewUserTemplate._email );
    expect( userSaved.name() ).toBe( aNewUserTemplate._name );
  } );
  
  it( 'should hash the new user password', async () => {
    jest.spyOn( repository, 'saveUser' ).mockImplementation( jestMockImplementation_SaveUser( mockMongoResults ) );

    const aNewUser: UserDTO = { ...aNewUserTemplate };
    const userSaved = await service.saveUser( aNewUser );
    expect( userSaved.password() ).not.toBe( aNewUserTemplate._password );
    expect( await userSaved.isCorrectPassword( aNewUser._password ) ).toBeTruthy();
  } );

  it( 'should throw if email is already in use', async () => {
    jest.spyOn( repository, 'saveUser' ).mockImplementation( jestMockImplementation_SaveUser( mockMongoResults ) );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    const aNewUserButSameEmail: UserDTO = { ...aNewUserButSameEmailTemplate };
    try {
      const userSaved = await service.saveUser( aNewUserButSameEmail );
      expect( userSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `User already exists. Can't save.` );
    }
  } );

  it( 'should find a user using a email', async () => {
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    const lookupMock: User = mockArrayTemplate[ 0 ];

    const userFound = await service.findUserByEmail( lookupMock.email() );
    const comparation = JSON.stringify( userFound ) == JSON.stringify( lookupMock );
    expect( comparation ).toBe( true );
  } );

  it( 'should throw error when not passing a email', async () => {
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    try {
      const userFound = await service.findUserByEmail( null );
      expect( userFound ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Email cannot be empty.` );
    }
  } );

  it( 'should throw error when a user is not found', async () => {
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    try {
      const userFound = await service.findUserByEmail( 'notInDatabase@email.com' );
      expect( userFound ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `User not found.` );
    }
  } );

  it( 'should update an existing user', async () => {
    jest.spyOn( repository, 'updateUserById' ).mockImplementation( jestMockImplementation_UpdateUserById( mockMongoResults ) );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    const userUpdated = await service.updateUser( mockMongoResults[ 0 ].email(), anUpdatedVersionOfUser );
    expect( mockMongoResults ).toContain( userUpdated );
  } );

  it( 'should update an existing user while passing an id', async () => {
    jest.spyOn( repository, 'updateUserById' ).mockImplementation( jestMockImplementation_UpdateUserById( mockMongoResults ) );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    anUpdatedVersionOfUser._id = mockMongoResults[ 0 ].id();

    const userUpdated = await service.updateUser( mockMongoResults[ 0 ].email(), anUpdatedVersionOfUser );
    expect( mockMongoResults ).toContain( userUpdated );
  } );

  it( 'should throw if not passing originalEmail when trying to update', async () => {
    jest.spyOn( repository, 'updateUserById' ).mockImplementation( jestMockImplementation_UpdateUserById( mockMongoResults ) );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    try {
      const userUpdated = await service.updateUser( '', anUpdatedVersionOfUser );
      expect( userUpdated ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'Must provide original email.' );
    }
  } );

  it( 'should throw on error while updating', async () => {
    jest.spyOn( repository, 'updateUserById' ).mockImplementation( async ( user: User ) => null );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    try {
      const userUpdated = await service.updateUser( mockMongoResults[ 0 ].email(), anUpdatedVersionOfUser );
      expect( userUpdated ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'Server Error while saving data.' );
    }
  } );

  it( 'should give the updated version of the user', async () => {
    jest.spyOn( repository, 'updateUserById' ).mockImplementation( jestMockImplementation_UpdateUserById( mockMongoResults ) );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    const userUpdated = await service.updateUser( mockMongoResults[ 0 ].email(), anUpdatedVersionOfUser );

    expect( userUpdated.email() ).toBe( anUpdatedVersionOfUserTemplate._email );
    expect( userUpdated.name() ).toBe( anUpdatedVersionOfUserTemplate._name );
    expect( userUpdated.id() ).toBe( "6fc56932-a379-4457-9082-cc4966b7a1f3" );
  } );

  it( 'should encrypt the password while updating', async () => {
    jest.spyOn( repository, 'deleteUserById' ).mockImplementation( jestMockImplementation_DeleteUserById( mockMongoResults ) );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    const anUpdatedVersionOfUser = { ...anUpdatedVersionOfUserTemplate };
    const userUpdated = await service.updateUser( mockMongoResults[ 0 ].email(), anUpdatedVersionOfUser );
    expect( anUpdatedVersionOfUserTemplate._password ).not.toBe( userUpdated.password );
    expect( await userUpdated.isCorrectPassword( anUpdatedVersionOfUserTemplate._password ) ).toBeTruthy();
  } );

  it( 'should delete a user', async () => {
    jest.spyOn( repository, 'deleteUserById' ).mockImplementation( jestMockImplementation_DeleteUserById( mockMongoResults ) );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    const deletedUser = await service.deleteUser( "fake1@email.com" );
    expect( mockMongoResults ).not.toContain( deletedUser );
    expect( mockMongoResults.length ).toBe( 2 );
    expect( mockArrayTemplate.length ).toBe( 3 );
  } );

  it( 'should throw if not passing an email while deleting', async () => {
    jest.spyOn( repository, 'deleteUserById' ).mockImplementation( jestMockImplementation_DeleteUserById( mockMongoResults ) );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    try {
      const deletedUser = await service.deleteUser( "" );
      expect( deletedUser ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'Email cannot be empty.' );
    }
  } );

  it( 'should throw if user could not be found by email while trying to deleted', async () => {
    jest.spyOn( repository, 'deleteUserById' ).mockImplementation( async ( id: string ) => null );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    try {
      const deletedUser = await service.deleteUser( "fakeInvalid@email.com" );
      expect( deletedUser ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'User not found.' );
    }
  } );

  it( 'should throw if user could not be deleted', async () => {
    jest.spyOn( repository, 'deleteUserById' ).mockImplementation( async ( id: string ) => null );
    jest.spyOn( repository, 'findUserByEmail' ).mockImplementation( jestMockImplementation_FindUserByEmail( mockMongoResults ) );

    try {
      const deletedUser = await service.deleteUser( "fake1@email.com" );
      expect( deletedUser ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'User could not be deleted.' );
    }
  } );


} );

function jestMockImplementation_UpdateUserById ( mockMongoResults: User[] ): ( user: User ) => Promise<User> {
  return async ( user: User ) => {
    const index = mockMongoResults.findIndex( ( elem => elem.id() == user.id() ) );
    mockMongoResults[ index ] = user;
    return mockMongoResults[ index ];
  };
}

function jestMockImplementation_DeleteUserById ( mockMongoResults: User[] ): ( id: string ) => Promise<User> {
  return async ( id: string ) => {
    const index = mockMongoResults.findIndex( ( elem => elem.id() == id ) );
    const deleted = mockMongoResults[ index ];
    mockMongoResults.splice( index, 1 );
    return deleted;
  };
}

function jestMockImplementation_FindUserByEmail ( mockMongoResults: User[] ): ( email: string ) => Promise<User> {
  return async ( email: string ) => mockMongoResults.find( ( elem ) => elem.email() === email );
}

function jestMockImplementation_SaveUser ( mockMongoResults: User[] ): ( user: User ) => Promise<User> {
  return async ( user: User ) => {
    mockMongoResults.push( user );
    return user;
  };
}
