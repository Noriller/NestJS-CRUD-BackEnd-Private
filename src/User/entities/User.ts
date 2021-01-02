import { BadRequestException } from '@nestjs/common';
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { compareHashPassword, generateHashPassword } from '../utils/utils';
import { UserDTO } from './User.dto';

@Entity()
export class User {

  @PrimaryColumn()
  @ObjectIdColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  constructor ( private user: UserDTO ) {

    if (!user.email)
      throw new BadRequestException('Email is required.');

    if (!user.name)
      throw new BadRequestException( 'Name is required.' );

    if ( !user.password )
      throw new BadRequestException( 'Password is required.' );
      
    this.userBuilder();
  }
    
  private userBuilder () {
    if ( !this.user.id ) {
        this.id = uuidv4();
      } else {
      this.id = this.user.id;
    }
    this.name = this.user.name;
    this.email = this.user.email;
    generateHashPassword( this.user.password ).then( hashedPassword => {
      this.password = hashedPassword;
      return;
    } )
  }

  async comparePassword ( password: string ) {
    return await compareHashPassword( password, this.password );
  }

}