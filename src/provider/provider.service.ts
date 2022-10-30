import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bc from 'bcrypt';
import { TwilioService } from 'nestjs-twilio';
import { ChangePasswordFromInsideInput, ChangePasswordFromOutsideInput, AddProductInputDTO, CompanyInputDTO, VerifyCompanyDto, ChangeCompanyInfoDTO } from 'src/app.dto';
import * as twilio from 'twilio'
import {} from 'twilio'
import { Provider } from './provider.model';
import {generateVerficationCode} from 'src/utils'
import { MessagingService } from 'src/messaging/messaging.service';
import { ProductEntry } from 'src/product/product.entry.model';
import { Product } from 'src/product/product.model';

@Injectable()
export class ProviderService {
    constructor(private configService: ConfigService, private msgService: MessagingService,){}    

    async findByPhoneNumber(phoneNumber: string) : Promise<Provider | null>{
        return await Provider.findOneBy({phoneNumber})
    }
    async changePassword(user: Provider, input: ChangePasswordFromInsideInput) : Promise<boolean>{
        const userInfo = await this.findByPhoneNumber(user.phoneNumber)
        if(!userInfo) return false;

        if(!await bc.compare(input.oldPassword,  userInfo.password)) return false;
        const salt = await bc.genSalt();
        userInfo.password = await bc.hash(input.newPassword, salt);
        userInfo.verificationCode = null;
        await userInfo.save()
        return true;
    }
    async generateVerificationCode(phoneNumber: string) : Promise<boolean>{
        const user = await this.findByPhoneNumber(phoneNumber);
        if(user.verificationCode) return false;
        user.phoneNumber = phoneNumber;
        user.verificationCode = generateVerficationCode() + "";
        await user.save();
        return true;
    }
    async changePasswordUsingCode(input: ChangePasswordFromOutsideInput): Promise<boolean>{
            const user = await this.findByPhoneNumber(input.phoneNumber);
            if(user.verificationCode != input.verificationCode) return false;
            const salt = await bc.genSalt();
            user.password = await bc.hash( input.password, salt);
            user.verificationCode = null;
            await user.save()
            return true
    }
    async verify(pro: Provider, input: VerifyCompanyDto): Promise<boolean>{

        const provider = await this.findByPhoneNumber(pro.phoneNumber);
        if(!provider || !provider.verificationCode) return false;
        
        Logger.log(`${Number(provider.verificationCode)} != ${input.verificationCode}`)
        if((provider.verificationCode) != input.verificationCode) return false;
        provider.isVerified = true;
        provider.verificationCode = null;
        await provider.save();
        return true;
    }
    async changeInfo(user:Provider , input: ChangeCompanyInfoDTO){
          if(input.bankAccount) user.bankAccount = input.bankAccount;
          if(input.name) user.name = input.name;
         // if(input.phoneNumber) user.phoneNumber = input.phoneNumber;
          if(input.tinNumber) user.tinNumber = input.tinNumber;

          await user.save();
    }
    async create(input: CompanyInputDTO) : Promise<Provider | null>{
          if(await Provider.findOneBy({phoneNumber: input.phoneNumber}) ){
            throw new BadRequestException({error: "There is an asscoiated account with this phone number"})
          }


          Logger.log(this.msgService.sendEmailTxt('ebenezertesfaye11@gmail.com', 'Hello', 'test'), 'Test')   
          const salt = await bc.genSalt();
          

          const provider = new Provider()
          provider.bankAccount = input.bankAccount;
          provider.name = input.name;
          provider.tinNumber = input.tinNumber;
          provider.password =  await bc.hash(input.password, salt);
          provider.phoneNumber = input.phoneNumber;
          provider.verificationCode = String(generateVerficationCode());
          await provider.save()
          return provider
    }

    async addProductEntry(userId: number, input: AddProductInputDTO ): Promise<ProductEntry | null>{
         //this finds the product first and adds the product name
        const entry = new ProductEntry()
        const adder = await Provider.findOneBy({id:  userId});
        const product = await Product.findOneBy({id: input.forProductId})
        entry.addedBy = adder;
        entry.forProduct  = product;
        entry.batchNumber = input.batchNumber;
        try{
            entry.expiryDate = Date.parse(input.expiryDate) + "";
        }catch(e){
            return null;
        }
        entry.remark = input.remark;
        entry.units = input.units
        entry.unitPrice = input.unitPrice;

        await entry.save();

        return entry;
    }
    async addProductUsingNewName(){

    }

    async removeUserVerification(id: number): Promise<boolean>{
        const provider = await Provider.findOneBy({id});
        if(!provider) return false;
        provider.isVerifiedAdmin = false;
        await provider.save();
        return false;
    }

    async verifyUser(id: number): Promise<boolean>{
        const provider = await Provider.findOneBy({id});
        Logger.log( `Provider ${JSON.stringify(provider)}`)
        if(!provider) return false;
        provider.isVerifiedAdmin = true;
        await provider.save();
        return true;

    }
    async getProductEntriesof(id: number): Promise<ProductEntry[] | null>{
       // const user = await Provider.findOneBy({id})
        const entries = await ProductEntry.findBy({addedBy:{id}})

        return entries
    }
}
