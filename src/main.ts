import { NestFactory } from '@nestjs/core';
import { IndexModule } from './index.module';

async function bootstrap() {
  const app = await NestFactory.create(IndexModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
