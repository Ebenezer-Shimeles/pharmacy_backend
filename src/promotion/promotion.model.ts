


import { Product } from "src/product/product.model";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'promo'})
export class Promo extends BaseEntity{
   
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column()
    news: string;
    
    @Column({name: 'pic_url', default: ''})
    picUrl: string;

    


}