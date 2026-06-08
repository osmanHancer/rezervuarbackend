import { Repository } from 'typeorm';
import { ModbusData } from '../entities/modbus-data.entity';
import { CreateModbusDataDto } from './dto/create-modbus-data.dto';

export class ModbusService {
  constructor(
    private readonly modbusDataRepository: Repository<ModbusData>,
  ) {}

  async create(createModbusDataDto: CreateModbusDataDto): Promise<ModbusData> {
    const totalCount = await this.modbusDataRepository.count();
    
    if (totalCount >= 100) {
      const [oldestRecord] = await this.modbusDataRepository.find({
        order: { timestamp: 'ASC' },
        take: 1,
      });
      
      if (oldestRecord) {
        Object.assign(oldestRecord, createModbusDataDto);
        oldestRecord.timestamp = new Date();
        return await this.modbusDataRepository.save(oldestRecord);
      }
    }
    
    const modbusData = this.modbusDataRepository.create(createModbusDataDto);
    return await this.modbusDataRepository.save(modbusData);
  }

  async findAll(): Promise<ModbusData[]> {
    return await this.modbusDataRepository.find({
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }

  async findByPort(port: string): Promise<ModbusData[]> {
    return await this.modbusDataRepository.find({
      where: { port },
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }

  async findByCycle(cycle: number): Promise<ModbusData[]> {
    return await this.modbusDataRepository.find({
      where: { cycle },
      order: { timestamp: 'DESC' },
    });
  }

  async getLatestByCycle(cycle: number): Promise<ModbusData | null> {
    return await this.modbusDataRepository.findOne({
      where: { cycle },
      order: { timestamp: 'DESC' },
    });
  }

  async getStatsByCycle(cycle: number) {
    const data = await this.findByCycle(cycle);
    
    if (data.length === 0) {
      return null;
    }

    const calculateStats = (field: string) => {
      const values = data
        .map((d) => d[field])
        .filter((v) => v !== null && v !== undefined);
      
      if (values.length === 0) return null;

      return {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length,
      };
    };

    return {
      cycle,
      totalRecords: data.length,
      rezervuarLitre: calculateStats('rezervuarLitre'),
      highPressure: calculateStats('highPressure'),
      lowPressure: calculateStats('lowPressure'),
      ambientTemperature: calculateStats('ambientTemperature'),
      hydraulicTemperature: calculateStats('hydraulicTemperature'),
      firstTimestamp: data[data.length - 1]?.timestamp,
      lastTimestamp: data[0]?.timestamp,
    };
  }
}
