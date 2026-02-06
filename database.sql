-- Hurjet Rezervuar Veritabanı Kurulum Scripti
-- MySQL 8.0+

-- Veritabanı oluştur
CREATE DATABASE IF NOT EXISTS hurjet_rezervuar 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE hurjet_rezervuar;

-- Tablo oluştur (TypeORM otomatik oluşturur ama manuel için)
CREATE TABLE IF NOT EXISTS `modbus_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `port` varchar(50) NOT NULL COMMENT 'COM port adı (örn: COM3)',
  `cycle` int DEFAULT NULL COMMENT 'Test cycle numarası',
  `rezervuarLitre` float DEFAULT NULL COMMENT 'Rezervuar seviyesi (litre)',
  `highPressure` float DEFAULT NULL COMMENT 'Yüksek basınç değeri',
  `lowPressure` float DEFAULT NULL COMMENT 'Düşük basınç değeri',
  `ambientTemperature` float DEFAULT NULL COMMENT 'Ortam sıcaklığı',
  `hydraulicTemperature` float DEFAULT NULL COMMENT 'Hidrolik sıcaklık',
  `valvePosition` float DEFAULT NULL COMMENT 'Valf pozisyonu',
  `timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'Kayıt zamanı',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Modbus sensör verilerini saklar';

-- Performans için indeksler
CREATE INDEX idx_port ON modbus_data(port);
CREATE INDEX idx_cycle ON modbus_data(cycle);
CREATE INDEX idx_timestamp ON modbus_data(timestamp);
CREATE INDEX idx_cycle_timestamp ON modbus_data(cycle, timestamp DESC);

-- Test için örnek sorgu
-- SELECT * FROM modbus_data ORDER BY timestamp DESC LIMIT 10;

-- Cycle'a göre istatistik sorgusu
-- SELECT 
--   cycle,
--   COUNT(*) as total_records,
--   AVG(rezervuarLitre) as avg_rezervuar,
--   MIN(rezervuarLitre) as min_rezervuar,
--   MAX(rezervuarLitre) as max_rezervuar,
--   AVG(highPressure) as avg_high_pressure,
--   AVG(lowPressure) as avg_low_pressure,
--   MIN(timestamp) as first_record,
--   MAX(timestamp) as last_record
-- FROM modbus_data
-- WHERE cycle = 1
-- GROUP BY cycle;

-- Eski verileri temizleme (opsiyonel - cron job ile kullanılabilir)
-- DELETE FROM modbus_data WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Veritabanı boyutu kontrolü
-- SELECT 
--   table_name AS `Table`,
--   ROUND(((data_length + index_length) / 1024 / 1024), 2) AS `Size (MB)`
-- FROM information_schema.TABLES
-- WHERE table_schema = 'hurjet_rezervuar'
-- ORDER BY (data_length + index_length) DESC;

