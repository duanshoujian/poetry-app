import { Injectable, Logger } from '@nestjs/common';
import { PoetryApiService } from '../poetry-api/poetry-api.service';
import { SEED_DYNASTIES } from '../seed/seed-data';

@Injectable()
export class DynastiesService {
  private readonly logger = new Logger(DynastiesService.name);

  constructor(private readonly poetryApiService: PoetryApiService) {}

  async findAll() {
    try {
      const data = await this.poetryApiService.getDynasties();

      if (Array.isArray(data)) {
        return { dynasties: data };
      }

      if (data && typeof data === 'object') {
        const d = data as Record<string, unknown>;
        const results = d.results ?? d.data ?? d.dynasties ?? [];
        if (Array.isArray(results)) {
          return { dynasties: results };
        }
      }
    } catch (error) {
      this.logger.warn(`诗泉 API 不可用，使用种子朝代数据`);
    }

    return { dynasties: SEED_DYNASTIES };
  }
}
