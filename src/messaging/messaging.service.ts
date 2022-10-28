import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

import * as  nodemailer from 'nodemailer';
import { Subject } from 'typeorm/persistence/Subject';

@Injectable()
export class MessagingService {

    constructor(private configService: ConfigService){}
    public async sendSms(to: string, body: string): Promise<boolean>{
        try{
            const sId = await this.configService.get('TWILIO_ACCOUNT_SID');
            const authToken = await this.configService.get('TWILIO_AUTH_TOKEN');
            Logger.log({sId, authToken})

            const msg =  twilio(
            sId, authToken
              
             );  
            const from = await this.configService.get('TWILIO_PHONE_NUMBER');
             msg.messages.create({
               body: "Hello this is a test", 
               from,
                to,
             })
             .then(message => Logger.log(`Sms Id: ${message.sid} from ${from}`, 'MessageService'));
             

         }catch(e){
           Logger.error(e.message, "MessageService")
           return false;
         }

    }
    public async sendEmailTxt(to: string, subject: string, text: string): Promise<boolean>{
         try{
           //    let testAccount = await nodemailer.createTestAccount();

                const fromEmail = this.configService.get('FROM_EMAIL');
                const emailHost = this.configService.get('EMAIL_SERVER');
                const fromEmailPassword = this.configService.get('EMAIL_PASSWORD');
                const emailHostPort = this.configService.get('EMAIL_SERVER_PORT')
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    
                    host: emailHost,
                    port: Number(emailHostPort),
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: fromEmail, // generated ethereal user
                        pass: fromEmailPassword, // generated ethereal password
                    },
                });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: fromEmail, // sender address
                    to: to, // list of receivers
                    subject, // Subject line
                    text, // plain text body
                   // html: "<b>Hello world?</b>", // html body
                });

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
         }
         catch(e){
            Logger.error(e.message , 'MessageService')
            return false;
         }
    }
}
