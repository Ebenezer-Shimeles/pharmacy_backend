import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Category } from "./category.model";
import { ProductEntry } from "./product.entry.model";


export enum ProductCategory{
    cream = 'Cream',
    equipment = 'Equipment',
    syrup = 'Syrup',
    tablet = 'Tablet'
}

@Entity()
export class Product extends BaseEntity{
    //This class acts as a 'category' class for ProductEntry
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type=>ProductEntry, entry=>entry.forProduct, {onDelete: "CASCADE"})
    entries: ProductEntry[]

    @Column({nullable: false, length: 100, unique: true})
    name: string;

 
    @Column({nullable: false})
    category: ProductCategory;

    @Column({name: 'unit_price', nullable: false})
    unitPrice: string;
    
    @CreateDateColumn({name: 'added_at'})
    addedAt: Date;




}