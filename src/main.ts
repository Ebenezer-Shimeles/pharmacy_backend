import { APP_FILTER, NestFactory,  } from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}))


  // const config = new DocumentBuilder()
  //   .setTitle('Solve Backend')
  //   .setDescription('Solve Backend')
  //   .setVersion('1.0')
  //   .addTag('solve')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  const config = new DocumentBuilder()
                 .setTitle('Solve Backend')
                 .setDescription('Solve Backend')
                 .setVersion('1.0')
                 .addBearerAuth({type: 'http'}, 'admin')
                 .addBearerAuth({type:'http'}, 'provider')
                 .addBearerAuth({type: 'http'}, 'retailer')
                 .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api',app, document)
  await app.listen(3000);
}
bootstrap();
