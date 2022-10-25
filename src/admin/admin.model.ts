

import { Column, PrimaryGeneratedColumn, Entity, BaseEntity, CreateDateColumn, ManyToMany } from "typeorm";
import { Permission } from "./permission.models";



@Entity({name: 'admin'})
export class Admin extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 25, name: 'first_name'})
    firstName: string;
   
    @Column({length: 25, name: 'last_name'})
    lastName: string;

    @Column({length: 100, nullable: false, unique: true})
    email: string;

    @CreateDateColumn({name: 'created_at'})
    createdDate: Date;

    @ManyToMany(type=> Permission)
    permissions: Permission[];

    @Column({name: 'password'})
    password: string;


}