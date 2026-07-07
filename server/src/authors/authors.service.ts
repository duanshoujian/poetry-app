import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PoetryApiService } from '../poetry-api/poetry-api.service';
import { SEED_AUTHORS, SEED_POEMS } from '../seed/seed-data';

@Injectable()
export class AuthorsService {
  private readonly logger = new Logger(AuthorsService.name);

  constructor(private readonly poetryApiService: PoetryApiService) {}

  async findAll(page: number, pageSize: number) {
    try {
      const data = await this.poetryApiService.getAuthors({
        page,
        page_size: pageSize,
      });

      if (Array.isArray(data)) {
        return {
          authors: data.map((item) => this.normalizeAuthor(item)),
          total: data.length,
        };
      }

      if (data && typeof data === 'object') {
        const d = data as Record<string, unknown>;
        const results = d.results ?? d.data ?? [];
        if (Array.isArray(results)) {
          return {
            authors: results.map((item: unknown) => this.normalizeAuthor(item)),
            total: d.count ?? d.total ?? results.length,
            page: d.page,
            pageSize: d.page_size,
          };
        }
      }
    } catch (error) {
      this.logger.warn(`诗泉 API 不可用，使用种子作者数据`);
    }
    return { authors: SEED_AUTHORS, total: SEED_AUTHORS.length };
  }

  async findOne(name: string) {
    try {
      const data = await this.poetryApiService.searchPoems({
        q: name,
        type: 'author',
      });

      const poems = this.extractPoems(data);
      if (poems.length > 0) {
        const firstPoem = poems[0] as Record<string, unknown>;
        const author = firstPoem.author;
        return {
          author: this.normalizeAuthor(author),
          poems: poems.map((p) => this.normalizePoem(p)),
          poemCount: poems.length,
        };
      }
    } catch {
      this.logger.warn(`诗泉 API 不可用，从种子数据查找作者: ${name}`);
    }

    // 从种子数据查找
    const decodedName = decodeURIComponent(name);
    const seedAuthor = SEED_AUTHORS.find(
      a => a.name === name || a.name === decodedName || a.id === name,
    );
    if (!seedAuthor) {
      throw new NotFoundException(`作者 "${name}" 未找到`);
    }
    const authorPoems = SEED_POEMS.filter(p => p.author.name === seedAuthor.name);
    return {
      author: seedAuthor,
      poems: authorPoems.map(p => ({
        id: p.id,
        title: p.title,
        content: p.content.split('\n')[0], // 首句预览
        dynasty: p.dynasty,
        type: p.type,
      })),
      poemCount: seedAuthor.poemCount,
    };
  }

  private extractPoems(data: unknown): unknown[] {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      const results = d.results ?? d.data ?? [];
      if (Array.isArray(results)) return results;
    }
    return [];
  }

  private normalizeAuthor(author: unknown) {
    if (!author) return { name: '' };
    if (typeof author === 'string') return { name: author };
    if (typeof author === 'object') {
      const a = author as Record<string, unknown>;
      return {
        id: a.id ?? Buffer.from((a.name as string) ?? '').toString('base64').slice(0, 20),
        name: a.name ?? '',
        dynasty: a.dynasty ?? '',
        description: a.description ?? '',
        birthYear: a.birth_year ?? a.birthYear ?? null,
        deathYear: a.death_year ?? a.deathYear ?? null,
      };
    }
    return { name: '' };
  }

  private normalizePoem(poem: unknown): Record<string, unknown> {
    if (!poem || typeof poem !== 'object') return {};
    const p = poem as Record<string, unknown>;
    return {
      id: p.id ?? '',
      title: p.title ?? '',
      content: p.content ?? '',
      dynasty: p.dynasty ?? '',
      type: p.type ?? '',
    };
  }
}
