import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('modbus_data')
export class ModbusData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  port: string;

  @Column({ type: 'int', nullable: true })
  cycle: number;

  @Column({ type: 'float', nullable: true })
  rezervuarLitre: number;

  @Column({ type: 'float', nullable: true })
  highPressure: number;

  @Column({ type: 'float', nullable: true })
  lowPressure: number;

  @Column({ type: 'float', nullable: true })
  ambientTemperature: number;

  @Column({ type: 'float', nullable: true })
  hydraulicTemperature: number;

  @Column({ type: 'float', nullable: true, default: 1 })
  valvePosition: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}

