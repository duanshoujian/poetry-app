import { Module } from '@nestjs/common';
import { PoemsController } from './poems.controller';
import { PoemsService } from './poems.service';
import { PoetryApiModule } from '../poetry-api/poetry-api.module';

@Module({
  imports: [PoetryApiModule],
  controllers: [PoemsController],
  providers: [PoemsService],
})
export class PoemsModule {}
