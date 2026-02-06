import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS ayarları - Electron uygulamasından erişim için
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`NestJS backend çalışıyor: http://localhost:${port}`);
  console.log(`Web Arayüz: http://localhost:${port}/`);
  console.log(`API Endpoints: http://localhost:${port}/api/`);
}
bootstrap();
