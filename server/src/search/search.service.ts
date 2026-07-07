import { Injectable, Logger } from '@nestjs/common';
import { PoetryApiService } from '../poetry-api/poetry-api.service';
import { SEED_POEMS } from '../seed/seed-data';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly poetryApiService: PoetryApiService) {}

  async search(q: string, type: string = 'all') {
    if (!q || q.trim().length === 0) {
      return { results: [], total: 0, query: q };
    }

    try {
      const data = await this.poetryApiService.searchPoems({
        q: q.trim(),
        type,
      });
      return this.formatSearchResults(data, q);
    } catch (error) {
      this.logger.warn(`诗泉 API 不可用，从种子数据搜索: ${q}`);
    }

    // 从种子数据搜索
    const keyword = q.trim().toLowerCase();
    const results = SEED_POEMS.filter(p => {
      if (type === 'title') return p.title.includes(keyword);
      if (type === 'author') return p.author.name.includes(keyword);
      if (type === 'content') return p.content.includes(keyword);
      // all
      return (
        p.title.includes(keyword) ||
        p.author.name.includes(keyword) ||
        p.content.includes(keyword)
      );
    }).map(p => ({
      id: p.id,
      title: p.title,
      author: p.author.name,
      dynasty: p.dynasty,
      type: p.type,
      content: p.content,
      highlights: this.extractHighlights(p.content, q.trim()),
    }));

    return { results, total: results.length, query: q };
  }

  private formatSearchResults(data: unknown, query: string) {
    if (Array.isArray(data)) {
      return {
        results: data.map((item) => this.normalizePoem(item, query)),
        total: data.length,
        query,
      };
    }

    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      const results = d.results ?? d.data ?? [];
      if (Array.isArray(results)) {
        return {
          results: results.map((item: unknown) => this.normalizePoem(item, query)),
          total: d.count ?? d.total ?? results.length,
          query,
        };
      }
    }

    return { results: [], total: 0, query };
  }

  private normalizePoem(poem: unknown, searchQuery: string): Record<string, unknown> {
    if (!poem || typeof poem !== 'object') return {};
    const p = poem as Record<string, unknown>;

    const author = p.author;
    const authorName =
      typeof author === 'string'
        ? author
        : typeof author === 'object' && author
          ? (author as Record<string, unknown>).name ?? ''
          : '';

    return {
      id:
        (p.id as string) ??
        Buffer.from(`${p.title ?? ''}_${authorName}`).toString('base64').slice(0, 20),
      title: p.title ?? '',
      author: authorName,
      dynasty: p.dynasty ?? '',
      type: p.type ?? '',
      content: p.content ?? '',
      highlights: this.extractHighlights(p.content as string, searchQuery),
    };
  }

  private extractHighlights(content: string, query: string): string {
    if (!content || !query) return content.slice(0, 100);
    const index = content.indexOf(query);
    if (index === -1) return content.slice(0, 100);
    const start = Math.max(0, index - 20);
    const end = Math.min(content.length, index + query.length + 80);
    return (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '');
  }
}
