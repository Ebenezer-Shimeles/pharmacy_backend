

import { IsNotEmpty, IsOptional, IsNumber } from "class-validator";
import {} from 'class-transformer'


export  class CompanyOutputDTO{
   

  
    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    createdAt: Date;

   
    @IsNotEmpty() 
    tinNumber: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    bankAccount: string;



}
export  class CompanyInputDTO{
   

  
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    password: string;


   
    @IsNotEmpty() 
    tinNumber: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    bankAccount: string;



}
export class AdminInputDTO{
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    lastName: string;
}
export class VerifyCompanyDto{
    @IsNotEmpty()
    verificationCode: string | number;
}

export class ChangePasswordFromOutsideInput{
    
    @IsOptional()
    verificationCode?: number | string

    @IsNotEmpty()
    phoneNumber: string;
    
    @IsOptional()
    password?: string;
}
export class ChangePasswordFromInsideInput{
    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    newPassword: string;
}
export class AddProductDTO{
    @IsNotEmpty()
    
    unitPrice: string;

    @IsNotEmpty()
    units: number;

    @IsNotEmpty()
    isApproved: boolean;

    @IsNotEmpty()
    expirationDate: Date;

    @IsNotEmpty()
    category: string; //this is unique
}
export class AdminOutputDTO{
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    lastName: string;
    @IsNotEmpty()
    createdDate:Date;
}

export class CompanyAuthInputDTO{
    @IsNotEmpty()
    phoneNumber: string;
    @IsNotEmpty()
    password: string;
}
export class AdminAuthInputDTO{
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;
}