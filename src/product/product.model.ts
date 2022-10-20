import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from "typeorm";
import { Category } from "./category.model";



@Entity()
export class Product extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, length: 100})
    name: string;

    @Column({name: 'batch_number'})
    batchNumber: number;
    
    @ManyToOne(type => Category, category => category.products)
    category: Category;
    
    @Column({name: 'expiry_date'})
    expiryDate: Date;

    @Column({type: 'int'})
    unit: number;

    @Column({name: 'unit_price'})
    unitPrice: string; //we store the double as string

    @Column({length: 255})
    remark: string;
}