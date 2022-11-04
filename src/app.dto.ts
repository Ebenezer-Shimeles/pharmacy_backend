

import { IsNotEmpty, IsOptional, IsNumber, IsString } from "class-validator";
import {} from 'class-transformer'
import { ProductCategory } from "./product/product.model";
import { ApiProperty } from "@nestjs/swagger";


export  class CompanyOutputDTO{
   
    
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsNotEmpty()
    createdAt: Date;

    @ApiProperty()
    @IsNotEmpty() 
    tinNumber: string;
    
    @ApiProperty()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    bankAccount: string;



}
export  class CompanyInputDTO{
   

    @ApiProperty()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsNotEmpty()
    password: string;


    @ApiProperty()
    @IsNotEmpty() 
    tinNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    bankAccount: string;



}
export class AddProductNameDTO{
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    category: ProductCategory;

    @ApiProperty()
    @IsNotEmpty()
    unitPrice: string;
}
export class ChangeCompanyPropicDTO{

}
export class ChangeCompanyInfoDTO{
    @IsOptional()
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    tinNumber: string;

    
    @ApiProperty()
    @IsOptional()
     @IsString()
    bankAccount: string;
}
export class AdminForgottenPasswordDTO{
    @IsOptional()
    @ApiProperty({description: 'if present taken as a verfication attempt. Otherwise, taken as a send key.'})
    verificationCode?: number | string

    @ApiProperty()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty()
    @IsOptional()
    password?: string;
}


export class AddPromoInputDTO{
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    msg: string;
}

export class AddToCartInputDTO{
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    productId: number;
}
export class AddProductInputDTO{
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    forProductId: number;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    expiryDate: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    unitPrice: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    batchNumber: string;
    

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    units: number;

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    remark: string;


}
export class AdminInputDTO{
    @IsNotEmpty()
    @ApiProperty()
    email: string;
    @IsNotEmpty()
    @ApiProperty()
    password: string;
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;
}
export class VerifyCompanyDto{
    @IsNotEmpty()
    @ApiProperty()
    verificationCode: string | number;
}

export class ChangePasswordFromOutsideInput{
    
    @IsOptional()
    @ApiProperty({description: 'If present, this will be taken as a verifcation code. otherwise sends the code'})
    verificationCode?: number | string

    @IsNotEmpty()
    @ApiProperty()
    phoneNumber: string;
    
    @IsOptional()
    @ApiProperty()
    password?: string;
}
export class ChangePasswordFromInsideInput{
    @IsNotEmpty()
    @ApiProperty()
    oldPassword: string;

    @ApiProperty()
    @ApiProperty()
    newPassword: string;
}
export class AddProductEntryDTO{
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    forProductId: number;
    

}

export class AddProductDTO{
    @IsNotEmpty()
    @ApiProperty()
    unitPrice: string;

    @ApiProperty()
    @IsNotEmpty()
    units: number;

    @ApiProperty()
    @IsNotEmpty()
    isApproved: boolean;

    @ApiProperty()
    @IsNotEmpty()
    expirationDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    category: string; //this is unique
}
export class AdminOutputDTO{
    @IsNotEmpty()
    @ApiProperty()
    email: string;
    
    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    createdDate:Date;
}

export class CompanyAuthInputDTO{
    @ApiProperty()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}
export class AdminAuthInputDTO{
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}