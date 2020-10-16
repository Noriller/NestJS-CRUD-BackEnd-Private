import { User } from '../entities/User';

interface IUserSharedServices {
  saveUser(user: User): Promise<User>;

  findAllUsers(): Promise<User[]>;
  findUserByEmail(email: string): Promise<User>;
}

export interface IUserServiceImplementation extends IUserSharedServices {
  findUserById(id: string): Promise<User>;
  updateUserById(user: User): Promise<User>;

  deleteUserById(id: string): Promise<void>;
}

export interface IUserServiceAbstraction extends IUserSharedServices {
  updateUser(originalEmail: string, newUserInfo: User): Promise<User>;
  deleteUser(email: string): Promise<void>;
}