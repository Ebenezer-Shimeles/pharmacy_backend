import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bc from 'bcrypt';
import { TwilioService } from 'nestjs-twilio';
import { ChangePasswordFromInsideInput, ChangePasswordFromOutsideInput, CompanyInputDTO, VerifyCompanyDto } from 'src/app.dto';
import * as twilio from 'twilio'
import {} from 'twilio'
import { Provider } from './provider.model';
import {generateVerficationCode} from 'src/utils'
import { MessagingService } from 'src/messaging/messaging.service';

@Injectable()
export class ProviderService {
    constructor(private configService: ConfigService, private msgService: MessagingService){}    

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
}
