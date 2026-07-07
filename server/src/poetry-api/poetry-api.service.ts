import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class PoetryApiService {
  private readonly logger = new Logger(PoetryApiService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('poetryApi.baseUrl') ?? 'http://localhost:1279';
  }

  async getPoems(params: { page?: number; page_size?: number }) {
    return this.request('/api/v1/poems', { params });
  }

  async searchPoems(params: { q: string; type?: string }) {
    return this.request('/api/v1/poems/search', { params });
  }

  async getRandomPoem(params?: { author?: string; type?: string; dynasty?: string }) {
    return this.request('/api/v1/poems/random', { params });
  }

  async getAuthors(params: { page?: number; page_size?: number }) {
    return this.request('/api/v1/authors', { params });
  }

  async getDynasties() {
    return this.request('/api/v1/dynasties');
  }

  private async request(path: string, config?: { params?: Record<string, unknown> }) {
    const url = `${this.baseUrl}${path}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: config?.params,
          timeout: 10000,
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(`请求诗泉 API 失败: ${url}`, axiosError.message);

      if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
        throw new Error('诗泉 API 服务不可用，请稍后再试');
      }

      if (axiosError.response) {
        throw new Error(`诗泉 API 返回错误: ${axiosError.response.status}`);
      }

      throw new Error(`请求诗泉 API 失败: ${axiosError.message}`);
    }
  }
}
