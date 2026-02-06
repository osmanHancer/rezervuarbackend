# Hurjet Rezervuar Backend Kurulum Kılavuzu

## Gereksinimler

- Node.js (v18 veya üzeri)
- MySQL Server (v8.0 veya üzeri)
- npm veya yarn

## Kurulum Adımları

### 1. MySQL Veritabanı Oluşturma

MySQL'e bağlanın ve veritabanını oluşturun:

```sql
CREATE DATABASE hurjet_rezervuar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Eğer farklı bir kullanıcı kullanacaksanız:
CREATE USER 'rezervuar_user'@'localhost' IDENTIFIED BY 'güçlü_şifre';
GRANT ALL PRIVILEGES ON hurjet_rezervuar.* TO 'rezervuar_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Ortam Değişkenlerini Ayarlama

`.env.example` dosyasını kopyalayıp `.env` olarak kaydedin:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyip veritabanı bilgilerinizi girin:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=hurjet_rezervuar
PORT=3000
```

### 3. Bağımlılıkları Yükleme

```bash
npm install
```

### 4. Uygulamayı Başlatma

**Geliştirme Modu** (otomatik yeniden başlatma ile):
```bash
npm run start:dev
```

**Production Modu**:
```bash
npm run build
npm run start:prod
```

### 5. Veritabanı Tabloları

TypeORM `synchronize: true` ile çalıştığı için tablolar otomatik oluşturulacaktır. İlk başlatmada `modbus_data` tablosu otomatik olarak oluşturulur.

**UYARI**: Production ortamında `synchronize: false` yapıp migration kullanın!

## API Endpoints

### Veri Gönderme (Electron uygulaması kullanır)
```
POST http://localhost:3000/modbus/data
Content-Type: application/json

{
  "port": "COM3",
  "cycle": 1,
  "rezervuarLitre": 100.5,
  "highPressure": 250.3,
  "lowPressure": 50.2,
  "ambientTemperature": 25.5,
  "hydraulicTemperature": 45.3,
  "valvePosition": 75.0
}
```

### Tüm Verileri Getir (son 100 kayıt)
```
GET http://localhost:3000/modbus/data
```

### Port'a Göre Veri Getir
```
GET http://localhost:3000/modbus/data/port/COM3
```

### Cycle'a Göre Veri Getir
```
GET http://localhost:3000/modbus/data/cycle/1
```

### Cycle'ın Son Verisini Getir
```
GET http://localhost:3000/modbus/data/cycle/1/latest
```

### Cycle İstatistikleri
```
GET http://localhost:3000/modbus/data/cycle/1/stats
```

## Veritabanı Şeması

```sql
CREATE TABLE `modbus_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `port` varchar(50) NOT NULL,
  `cycle` int DEFAULT NULL,
  `rezervuarLitre` float DEFAULT NULL,
  `highPressure` float DEFAULT NULL,
  `lowPressure` float DEFAULT NULL,
  `ambientTemperature` float DEFAULT NULL,
  `hydraulicTemperature` float DEFAULT NULL,
  `valvePosition` float DEFAULT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_port` (`port`),
  KEY `idx_cycle` (`cycle`),
  KEY `idx_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Performans İyileştirmeleri (Opsiyonel)

Veritabanında indeksler oluşturmak sorgu performansını artırır:

```sql
USE hurjet_rezervuar;

-- Port bazlı sorgular için
CREATE INDEX idx_port ON modbus_data(port);

-- Cycle bazlı sorgular için
CREATE INDEX idx_cycle ON modbus_data(cycle);

-- Zaman bazlı sorgular için
CREATE INDEX idx_timestamp ON modbus_data(timestamp);

-- Birleşik indeks (cycle + timestamp sorgular için)
CREATE INDEX idx_cycle_timestamp ON modbus_data(cycle, timestamp DESC);
```

## Sorun Giderme

### MySQL Bağlantı Hatası
- MySQL servisinin çalıştığından emin olun
- `.env` dosyasındaki bağlantı bilgilerini kontrol edin
- Firewall/güvenlik duvarı ayarlarını kontrol edin

### Port Zaten Kullanımda Hatası
- `.env` dosyasında PORT değişkenini değiştirin
- Veya çalışan uygulamayı durdurun

### Axios Hatası (Electron tarafında)
- NestJS backend'inin çalıştığından emin olun
- API URL'sinin doğru olduğunu kontrol edin (`modbusChild.ts` içinde `API_URL`)
- CORS ayarlarının aktif olduğunu doğrulayın

## Electron Uygulaması Entegrasyonu

Electron uygulamanız (`src-electron/modbusChild.ts`) otomatik olarak her polling döngüsünde verileri API'ye gönderir. Backend'in çalıştığından emin olun:

1. Backend'i başlatın: `cd rezervuarbackend && npm run start:dev`
2. Electron uygulamasını başlatın
3. Test başlattığınızda veriler hem Excel'e hem MySQL'e kaydedilir

## Production Notları

1. `app.module.ts` içinde `synchronize: false` yapın
2. TypeORM migrations kullanın
3. Güçlü veritabanı şifreleri kullanın
4. CORS ayarlarını spesifik origin'lere kısıtlayın
5. Rate limiting ekleyin
6. Logging ve monitoring ekleyin

