import { Company } from "src/company.model";

import { Entity, OneToMany, TransactionAlreadyStartedError } from "typeorm";
import { RetailerTransaction } from "./retailer.transaction.model";


@Entity()
export class Retailer extends Company{

    @OneToMany(type=> RetailerTransaction, transaction=> transaction.retailer)
    transactions: RetailerTransaction[];
}