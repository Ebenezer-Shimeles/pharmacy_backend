import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.model";



@Entity()
export class Category extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;


    @Column({length: 20, unique: true})
    name: string;

    @OneToMany(type=> Product,  product => product.category)
    //@JoinTable('')
    products: Product[];
}