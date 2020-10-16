import { User } from '../entities/User';

interface IUserSharedServices {
  saveUser(user: User): Promise<User>;

  findAllUsers(): Promise<User[]>;
  findUserByEmail(email: string): Promise<User>;
  findUserById(id: string): Promise<User>;

  deleteUser(id: string): Promise<void>;
}

export interface IUserServiceImplementation extends IUserSharedServices {
  updateUserById(user: User): Promise<User>;
}

export interface IUserServiceAbstraction extends IUserSharedServices {
  updateUser(user: User): Promise<User>;
}