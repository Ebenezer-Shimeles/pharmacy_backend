import { Injectable, BadRequestException,Logger  } from '@nestjs/common';
import { Retailer } from './retailer.model';
import * as bc from 'bcrypt';
import { ChangePasswordFromInsideInput, ChangePasswordFromOutsideInput,ChangeCompanyInfoDTO,  VerifyCompanyDto } from 'src/app.dto';
import {generateVerficationCode} from 'src/utils';
import { CompanyInputDTO } from 'src/app.dto';

@Injectable()
export class RetailerService {
  async findByPhoneNumber(phoneNumber: string) : Promise<Retailer | null>{
    return await Retailer.findOneBy({phoneNumber})
}
async changeInfo(user:Retailer , input: ChangeCompanyInfoDTO){
  if(input.bankAccount) user.bankAccount = input.bankAccount;
  if(input.name) user.name = input.name;
 // if(input.phoneNumber) user.phoneNumber = input.phoneNumber;
  if(input.tinNumber) user.tinNumber = input.tinNumber;

  await user.save();
}
async changePassword(user: Retailer, input: ChangePasswordFromInsideInput) : Promise<boolean>{
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
async verify(pro: Retailer, input: VerifyCompanyDto): Promise<boolean>{

  const retailer = await this.findByPhoneNumber(pro.phoneNumber);
  if(!retailer || !retailer.verificationCode) return false;
  
  Logger.log(`${Number(retailer.verificationCode)} != ${input.verificationCode}`)
  if((retailer.verificationCode) != input.verificationCode) return false;
  retailer.isVerified = true;
  retailer.verificationCode = null;
  await retailer.save();
  return true;
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
        retailer.verificationCode = generateVerficationCode() + "";
        await retailer.save()
        return retailer
  }
}
