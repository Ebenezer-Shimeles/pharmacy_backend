import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagingService } from './messaging.service';

@Module({
    providers: [ConfigService, MessagingService],
    imports: [ConfigModule],
    exports: [MessagingService]
})
export class MessagingModule {}
