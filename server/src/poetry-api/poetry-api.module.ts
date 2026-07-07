import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PoetryApiService } from './poetry-api.service';

@Module({
  imports: [HttpModule],
  providers: [PoetryApiService],
  exports: [PoetryApiService],
})
export class PoetryApiModule {}
