import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserDTO } from './User.dto';

export class User {

  public id: string;
  public name: string;
  public email: string;
  public password: string;

  constructor(user: UserDTO) {

    if (!user.email)
      throw new BadRequestException('Email is required.');

    if (!user.name)
      throw new BadRequestException('Name is required.');

    Object.assign(this, user);

    if (!user.id) {
      this.id = uuidv4();
    } else {
      this.id = user.id;
    }

  }

}