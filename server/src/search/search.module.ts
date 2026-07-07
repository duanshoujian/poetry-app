import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PoetryApiModule } from '../poetry-api/poetry-api.module';

@Module({
  imports: [PoetryApiModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
