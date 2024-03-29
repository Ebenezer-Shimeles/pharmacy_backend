import { Provider } from "src/provider/provider.model";
import { Column, PrimaryGeneratedColumn, CreateDateColumn, Entity, BaseEntity, ManyToOne, JoinColumn,} from "typeorm";
import { Category } from "./category.model";
import { Product } from "./product.model";



@Entity()
export class ProductEntry extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn({name:'added_at'})
    addedAt: Date;

    @Column({name: 'expiry_date'})
    expiryDate: string; //unix epoch time
    
    @ManyToOne(type=>Product, {cascade: true})
    @JoinColumn({name: 'for_product'})
    forProduct: Product

    @Column({name: 'unit_price', nullable: false})
    unitPrice: string;

    @Column({name: 'batch_number'})
    batchNumber: string;
    

    @Column({nullable: false})
    units: number;

    @Column({name: 'is_approved', default: false})
    isApproved: boolean;

    
    @Column({length: 255})
    remark: string;
    
    
    @ManyToOne(type=>Provider, provider => provider.products, {nullable: false, cascade: true})
    @JoinColumn({name: 'added_by'})
    addedBy: Provider
  

    
} 