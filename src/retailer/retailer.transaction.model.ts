

import { Product } from 'src/product/product.model';
import { Provider } from 'src/provider/provider.model';
import {Column, PrimaryGeneratedColumn, Entity, BaseEntity, ManyToMany, ManyToOne, CreateDateColumn} from 'typeorm';
import { Retailer } from './retailer.model';

@Entity()
export class RetailerTransaction extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type=>Retailer, ret=>ret.transactions)
    retailer: Retailer;

    @ManyToOne(type=>Provider, )
    provider: Provider;

    @ManyToOne(type=>Product)
    product: Product;
    
    @Column()
    unit: number;
    
    @CreateDateColumn()
    transactionDate: Date;

}