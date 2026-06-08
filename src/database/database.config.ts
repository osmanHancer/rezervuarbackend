import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Channel } from '../common/channels';
import { ModbusData } from '../entities/modbus-data.entity';

export function getDatabaseConfig(
  channel: Channel,
  config: ConfigService,
): TypeOrmModuleOptions {
  const dbKey = `DB_DATABASE_${channel.toUpperCase()}` as const;

  return {
    name: channel,
    type: 'mysql',
    host: config.get<string>('DB_HOST', 'localhost'),
    port: parseInt(String(config.get('DB_PORT') ?? '3306'), 10),
    username: config.get<string>('DB_USERNAME', 'root'),
    password: config.get<string>('DB_PASSWORD', ''),
    database:
      config.get<string>(dbKey) ?? `hurjet_rezervuar_${channel}`,
    entities: [ModbusData],
    synchronize: true,
    logging: false,
  };
}
