import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { uuid } from "uuidv4";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public readonly id: string;

    @Column()
    public name: string;

    @Column()
    public email: string;

    @Column()
    public password: string;

    constructor(props: Omit<User, 'id'>, id?: string) {
        Object.assign(this, props);

        if (!id) {
            this.id = uuid();
        }
    }
}