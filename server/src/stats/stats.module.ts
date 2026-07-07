import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { PoetryApiModule } from '../poetry-api/poetry-api.module';

@Module({
  imports: [PoetryApiModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
