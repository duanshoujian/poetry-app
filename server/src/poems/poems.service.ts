import { Injectable, Logger } from '@nestjs/common';
import { PoetryApiService } from '../poetry-api/poetry-api.service';
import { SEED_POEMS } from '../seed/seed-data';

/**
 * 诗泉 API 返回的字段类型不统一：
 *  - content 可能是 string 或 string[]（多段落）
 *  - dynasty / type 可能是 string 或 { name, ... } 对象
 * 这里在 BFF 边界统一归一化为字符串，保证前端契约稳定。
 */
export function normalizeToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== null && item !== undefined)
      .map((item) => (typeof item === 'string' || typeof item === 'number' ? String(item) : normalizeToString(item)))
      .join('\n');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.name === 'string') return obj.name;
    return '';
  }
  return String(value);
}

@Injectable()
export class PoemsService {
  private readonly logger = new Logger(PoemsService.name);

  constructor(private readonly poetryApiService: PoetryApiService) {}

  async findAll(page: number, pageSize: number) {
    try {
      const data = await this.poetryApiService.getPoems({
        page,
        page_size: pageSize,
      });
      return this.formatPoemsResponse(data, page, pageSize);
    } catch (error) {
      this.logger.warn(`诗泉 API 不可用，使用种子数据: ${(error as Error).message}`);
      return {
        poems: SEED_POEMS.map(p => this.formatSeedPoem(p)),
        total: SEED_POEMS.length,
        page,
        pageSize,
      };
    }
  }

  async findRandom(author?: string, type?: string, dynasty?: string) {
    try {
      const data = await this.poetryApiService.getRandomPoem({
        author,
        type,
        dynasty,
      });
      return this.formatSinglePoem(data);
    } catch (error) {
      this.logger.warn(`诗泉 API 不可用，随机返回种子数据`);
      const filtered = SEED_POEMS.filter(p => {
        if (author && p.author.name !== author) return false;
        if (dynasty && p.dynasty !== dynasty) return false;
        if (type && p.type !== type) return false;
        return true;
      });
      const poem = filtered[Math.floor(Math.random() * filtered.length)] || SEED_POEMS[0];
      return this.formatSeedPoem(poem);
    }
  }

  async findFeatured() {
    try {
      const poems = [];
      for (let i = 0; i < 8; i++) {
        try {
          const data = await this.poetryApiService.getRandomPoem();
          const formatted = this.formatSinglePoem(data);
          if (formatted) poems.push(formatted);
        } catch {
          // 单首失败不影响其他
        }
      }
      if (poems.length > 0) return poems;
    } catch {
      // 降级到种子数据
    }
    // 使用种子数据
    const shuffled = [...SEED_POEMS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8).map(p => this.formatSeedPoem(p));
  }

  async findOne(title: string) {
    try {
      const data = await this.poetryApiService.searchPoems({
        q: title,
        type: 'title',
      });
      const results = this.formatPoemsResponse(data, 1, 10);
      if (results.poems && results.poems.length > 0) {
        return results.poems[0];
      }
    } catch {
      this.logger.warn(`诗泉 API 不可用，从种子数据查找: ${title}`);
    }
    // 从种子数据查找
    const seed = SEED_POEMS.find(
      p => p.title === title || p.id === title || decodeURIComponent(title) === p.title,
    );
    return seed ? this.formatSeedPoem(seed) : null;
  }

  private formatSinglePoem(data: unknown): unknown {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data[0] ? this.normalizePoem(data[0]) : null;
    }
    return this.normalizePoem(data);
  }

  private formatPoemsResponse(data: unknown, page: number, pageSize: number) {
    if (Array.isArray(data)) {
      return {
        poems: data.map((item) => this.normalizePoem(item)),
        total: data.length,
        page,
        pageSize,
      };
    }
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      if (d.results && Array.isArray(d.results)) {
        return {
          poems: d.results.map((item: unknown) => this.normalizePoem(item)),
          total: d.count ?? d.total ?? (d.results as unknown[]).length,
          page: d.page,
          pageSize: d.page_size,
        };
      }
    }
    return { poems: [], total: 0, page, pageSize };
  }

  private normalizePoem(poem: unknown): Record<string, unknown> {
    if (!poem || typeof poem !== 'object') return {};
    const p = poem as Record<string, unknown>;
    return {
      id: p.id ?? this.generateId(p),
      title: p.title ?? '',
      content: normalizeToString(p.content),
      author: this.normalizeAuthor(p.author),
      dynasty: normalizeToString(p.dynasty),
      type: normalizeToString(p.type),
      source: p.source ?? '',
      paragraphs: p.paragraphs ?? [],
      notes: p.notes ?? [],
      strains: p.strains ?? [],
    };
  }

  private normalizeAuthor(author: unknown) {
    if (!author) return { name: '' };
    if (typeof author === 'string') return { name: author };
    if (typeof author === 'object') {
      const a = author as Record<string, unknown>;
      return {
        name: a.name ?? '',
        dynasty: a.dynasty ?? '',
        description: a.description ?? '',
      };
    }
    return { name: '' };
  }

  private formatSeedPoem(seed: (typeof SEED_POEMS)[number]) {
    return {
      id: seed.id,
      title: seed.title,
      content: seed.content,
      author: {
        name: seed.author.name,
        dynasty: seed.author.dynasty,
        description: seed.author.description,
      },
      dynasty: seed.dynasty,
      type: seed.type,
      translation: seed.translation,
      annotation: seed.annotation,
      appreciation: seed.appreciation,
    };
  }

  private generateId(poem: Record<string, unknown>): string {
    const title = (poem.title as string) ?? '';
    const author = poem.author;
    const authorName =
      typeof author === 'string'
        ? author
        : typeof author === 'object' && author
          ? (author as Record<string, unknown>).name ?? ''
          : '';
    return Buffer.from(`${title}_${authorName}`).toString('base64').slice(0, 20);
  }
}
