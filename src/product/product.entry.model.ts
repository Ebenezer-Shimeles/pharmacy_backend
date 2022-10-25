import { Column, PrimaryGeneratedColumn, CreateDateColumn, Entity, BaseEntity, ManyToOne } from "typeorm";
import { Category } from "./category.model";



@Entity()
export class ProductEntry{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'unit_price', nullable: false})
    unitPrice: string;

    @Column()
    units: number;

    @Column({name: 'is_approved'})
    isApproved: boolean;

    @Column({name: 'expiration_date'})
    expirationDate: Date;

    @ManyToOne(type => Category)
    category: Category;
} 