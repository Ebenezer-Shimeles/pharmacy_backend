import { Column, PrimaryGeneratedColumn, CreateDateColumn, Entity, BaseEntity, ManyToOne } from "typeorm";
import { Category } from "./category.model";
import { Product } from "./product.model";



@Entity()
export class ProductEntry{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'expiry_date'})
    expiryDate: Date;
    
    @ManyToOne(type=>Product)
    forProduct: Product

    @Column({name: 'unit_price', nullable: false})
    unitPrice: string;

    @Column({name: 'batch_number'})
    batchNumber: number;
    

    @Column({nullable: false})
    units: number;

    @Column({name: 'is_approved', default: false})
    isApproved: boolean;

    
    @Column({length: 255})
    remark: string;

  

    
} 