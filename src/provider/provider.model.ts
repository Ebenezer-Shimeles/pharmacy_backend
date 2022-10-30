import { Company } from "src/company.model";
import { ProductEntry } from "src/product/product.entry.model";
import { Product } from "src/product/product.model";

import { Entity, OneToMany } from "typeorm";


@Entity()
export class Provider extends Company{
    
    @OneToMany(type=>ProductEntry, entry=>entry.addedBy)
    products: ProductEntry[]
}