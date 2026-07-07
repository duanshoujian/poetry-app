import { Module } from '@nestjs/common';
import { DynastiesController } from './dynasties.controller';
import { DynastiesService } from './dynasties.service';
import { PoetryApiModule } from '../poetry-api/poetry-api.module';

@Module({
  imports: [PoetryApiModule],
  controllers: [DynastiesController],
  providers: [DynastiesService],
})
export class DynastiesModule {}
