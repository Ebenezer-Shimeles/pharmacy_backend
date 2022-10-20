

import { Column, PrimaryGeneratedColumn, BaseEntity, Entity } from "typeorm";


@Entity()
export class Company extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    name: string;

    @Column()
    password: string;

    @Column({length: 10, name: 'verification_code'})
    verificationCode: string;

    @Column({length: 15, name: 'phone_number'})
    phoneNumber: string;

    @Column({name: 'bank_account', length: 50})
    bankAccount: string;
}