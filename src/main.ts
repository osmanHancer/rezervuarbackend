import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// .env dosyasını uygulama başlamadan önce yükle (cwd = rezervuarbackend klasörü)
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
  config({ path: envPath });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS ayarları - Electron uygulamasından erişim için
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(
    `MySQL: ${process.env.DB_USERNAME}@${process.env.DB_HOST} (şifre: ${process.env.DB_PASSWORD ? 'ayarlı' : 'boş'})`,
  );
  console.log(`NestJS backend çalışıyor: http://localhost:${port}`);
  console.log(`Web Arayüz: http://localhost:${port}/`);
  console.log(`API Kanalları: http://localhost:${port}/api/a | /api/b | /api/c`);
}
bootstrap();
