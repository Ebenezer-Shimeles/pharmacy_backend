


import { Product } from "src/product/product.model";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'promo'})
export class Promo extends BaseEntity{
   
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Product)
    forProduct: Product;
    
    @Column({name: 'pic_url'})
    picUrl: string;

    


}