import { Injectable, BadRequestException,  } from '@nestjs/common';
import { Retailer } from './retailer.model';
import * as bc from 'bcrypt';
import { CompanyInputDTO } from 'src/app.dto';

@Injectable()
export class RetailerService {
  async findByPhoneNumber(phoneNumber: string) : Promise<Retailer | null>{
    return await Retailer.findOneBy({phoneNumber})
}
    async create(input: CompanyInputDTO) : Promise<Retailer>{
        if(await Retailer.findOneBy({phoneNumber: input.phoneNumber}) ){
          throw new BadRequestException({error: "There is an asscoiated account with this phone number"})
        }
        const salt = await bc.genSalt();


        const retailer = new Retailer()
        retailer.bankAccount = input.bankAccount;
        retailer.name = input.name;
        retailer.tinNumber = input.tinNumber;
        retailer.password =  await bc.hash(input.password, salt);
        retailer.phoneNumber = input.phoneNumber;
        await retailer.save()
        return retailer
  }
}
