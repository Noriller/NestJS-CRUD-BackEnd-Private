import { v4 as uuidv4 } from 'uuid';

export class User {

  public readonly id: string;
  public name: string;
  public email: string;
  public password: string;

  constructor(props: Omit<User, 'id'>, id?: string) {

    if (!props.email)
      throw new Error('Email is required.');

    if (!props.name)
      throw new Error('Name is required.');

    if (!props.password)
      throw new Error('Password is required.');

    Object.assign(this, props);

    if (!id) {
      this.id = uuidv4();
    }
  }

}