import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { compareHashPassword, generateHashPassword } from '../utils/utils';
import { UserDTO } from './User.dto';

export class User {

  private _id: string;
  private _name: string;
  private _email: string;
  private _password: string;

  public constructor ( user: UserDTO ) {
    if ( !user._email )
      throw new BadRequestException('Email is required.');
  
    if ( !user._name )
      throw new BadRequestException('Name is required.');
    
    if ( !user._password )
      throw new BadRequestException( 'Password is required.' );

    Object.assign(this, user);
  }

  public async buildUser () {
    await this.hashPassword();

    if ( !this._id ) {
      this._id = uuidv4();
    }

    return this;
  }

  private async hashPassword () {
    this._password = await User.generateHashedPassword( this._password );
  }

  public id () {
    return this._id;
  }

  public name () {
    return this._name;
  }

  public email () {
    return this._email;
  }

  public password () {
    return this._password;
  }

  public async isCorrectPassword ( password: string ) {
    return await compareHashPassword( password, this._password )
  }

  public static async generateHashedPassword ( password: string ): Promise<string> {
    return await generateHashPassword( password );
  }


}