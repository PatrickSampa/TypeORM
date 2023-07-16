import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; 
import { logInterceptors } from './interceptors/log.interceptors';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  /* app.use(cors());  */
  /* app.useGlobalInterceptors(new logInterceptors) */
  app.enableCors();
  await app.listen(3000);
}
bootstrap();