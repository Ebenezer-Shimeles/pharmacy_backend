import { Product } from "src/product/product.model";
import { Retailer } from "src/retailer/retailer.model";
import { Column, Entity, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";


@Entity()
export class CartEntry{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Product)
    product: Product;

    @ManyToOne(type => Retailer)
    retaile: Retailer

    @CreateDateColumn({name: 'added_at'})
    addedAt: Date;
}


