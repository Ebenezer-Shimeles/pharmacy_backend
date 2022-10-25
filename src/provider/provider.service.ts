import { BadRequestException, Injectable } from '@nestjs/common';
import * as bc from 'bcrypt';
import { CompanyInputDTO } from 'src/app.dto';
import { Provider } from './provider.model';

@Injectable()
export class ProviderService {

    async findByPhoneNumber(phoneNumber: string) : Promise<Provider | null>{
        return await Provider.findOneBy({phoneNumber})
    }
    async create(input: CompanyInputDTO) : Promise<Provider>{
          if(await Provider.findOneBy({phoneNumber: input.phoneNumber}) ){
            throw new BadRequestException({error: "There is an asscoiated account with this phone number"})
          }
          const salt = await bc.genSalt();


          const provider = new Provider()
          provider.bankAccount = input.bankAccount;
          provider.name = input.name;
          provider.tinNumber = input.tinNumber;
          provider.password =  await bc.hash(input.password, salt);
          provider.phoneNumber = input.phoneNumber;
          await provider.save()
          return provider
    }
}
