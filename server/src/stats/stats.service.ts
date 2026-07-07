import { Injectable, Logger } from '@nestjs/common';
import { PoetryApiService } from '../poetry-api/poetry-api.service';
import { SEED_POEMS, SEED_AUTHORS, SEED_DYNASTIES } from '../seed/seed-data';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(private readonly poetryApiService: PoetryApiService) {}

  async getStats() {
    try {
      const [poemsData, authorsData, dynastiesData] = await Promise.all([
        this.poetryApiService.getPoems({ page: 1, page_size: 1 }),
        this.poetryApiService.getAuthors({ page: 1, page_size: 1 }),
        this.poetryApiService.getDynasties(),
      ]);

      return {
        poemCount: this.extractCount(poemsData),
        authorCount: this.extractCount(authorsData),
        dynastyCount: this.extractArrayLength(dynastiesData),
      };
    } catch {
      this.logger.warn('诗泉 API 不可用，使用种子统计数据');
      return {
        poemCount: SEED_POEMS.length,
        authorCount: SEED_AUTHORS.length,
        dynastyCount: SEED_DYNASTIES.length,
      };
    }
  }

  private extractCount(data: unknown): number {
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      if (typeof d.count === 'number') return d.count;
      if (typeof d.total === 'number') return d.total;
    }
    return 0;
  }

  private extractArrayLength(data: unknown): number {
    if (Array.isArray(data)) return data.length;
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      const arr = d.results ?? d.data ?? d.dynasties ?? [];
      if (Array.isArray(arr)) return arr.length;
    }
    return 0;
  }
}
