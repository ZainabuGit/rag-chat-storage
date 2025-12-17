import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async checkDb(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async getHealth() {
    const dbUp = await this.checkDb();
    return {
      status: dbUp ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      db: dbUp ? 'up' : 'down',
      uptime: process.uptime(),
    };
  }
}
