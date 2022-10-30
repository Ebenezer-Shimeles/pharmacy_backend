import { ProductEntry } from "src/product/product.entry.model";
import { Product } from "src/product/product.model";
import { Retailer } from "src/retailer/retailer.model";
import { Column, Entity, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";


@Entity()
export class CartEntry extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => ProductEntry)
    product: ProductEntry;

    @ManyToOne(type => Retailer)
    retailer: Retailer

    @CreateDateColumn({name: 'added_at'})
    addedAt: Date;
}


