import { Repository } from 'typeorm';
import { Channel } from '../common/channels';
import { ModbusData } from '../entities/modbus-data.entity';

export class StatusService {
  constructor(private readonly modbusDataRepository: Repository<ModbusData>) {}

  async getLatestData(channel: Channel) {
    const [latestRecord] = await this.modbusDataRepository.find({
      order: { timestamp: 'DESC' },
      take: 1,
    });

    if (!latestRecord) {
      return {
        channel,
        status: 'no_data',
        message: 'Henüz veri yok',
        data: null,
      };
    }

    // Veri yaşını hesapla (kaç saniye önce)
    const now = new Date();
    const dataAge = Math.floor(
      (now.getTime() - new Date(latestRecord.timestamp).getTime()) / 1000,
    );

    return {
      channel,
      status: dataAge < 30 ? 'online' : 'offline',
      dataAge: dataAge,
      lastUpdate: latestRecord.timestamp,
      data: {
        port: latestRecord.port,
        cycle: latestRecord.cycle,
        rezervuarLitre: latestRecord.rezervuarLitre,
        highPressure: latestRecord.highPressure,
        lowPressure: latestRecord.lowPressure,
        ambientTemperature: latestRecord.ambientTemperature,
        hydraulicTemperature: latestRecord.hydraulicTemperature,
      },
    };
  }

  async getAllRecentData(limit: number = 20) {
    return await this.modbusDataRepository.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}

