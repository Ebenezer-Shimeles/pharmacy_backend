

import { Column, PrimaryGeneratedColumn, BaseEntity, Entity, CreateDateColumn } from "typeorm";



export abstract class  Company extends BaseEntity{

    @CreateDateColumn()
    createdAt: Date;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    name: string;

    @Column()
    password: string;

    @Column({length: 10, name: 'verification_code', nullable: true})
    verificationCode: string;

    @Column({name: 'tin_number'})
    tinNumber: string;

    @Column({length: 15, name: 'phone_number', unique: true})
    phoneNumber: string;

    @Column({name: 'bank_account', length: 50})
    bankAccount: string;

    @Column({name: 'is_verified', default: false})
    isVerified: boolean;
    
    @Column({name: 'is_verified_admin', default: true})
    isVerifiedAdmin: boolean;

    @Column({name: 'pic_loc', default: ''})
    picLocation: string;
}