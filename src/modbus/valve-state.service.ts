import { Injectable } from '@nestjs/common';

@Injectable()
export class ValveStateService {
  private currentValvePosition: number = 1; // Başlangıçta 1
  private lastUpdateTime: Date = new Date();

  setValvePosition(position: number): void {
    this.currentValvePosition = position;
    this.lastUpdateTime = new Date();
  }

  getValvePosition(): { position: number; lastUpdate: Date } {
    return {
      position: this.currentValvePosition,
      lastUpdate: this.lastUpdateTime,
    };
  }

  resetToDefault(): void {
    this.currentValvePosition = 1;
    this.lastUpdateTime = new Date();
  }
}

