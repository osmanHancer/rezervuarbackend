export class CreateModbusDataDto {
  port: string;
  cycle?: number;
  rezervuarLitre?: number;
  highPressure?: number;
  lowPressure?: number;
  ambientTemperature?: number;
  hydraulicTemperature?: number;
  valvePosition?: number;
}

