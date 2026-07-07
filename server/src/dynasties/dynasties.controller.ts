import { Controller, Get } from '@nestjs/common';
import { DynastiesService } from './dynasties.service';

@Controller('api/dynasties')
export class DynastiesController {
  constructor(private readonly dynastiesService: DynastiesService) {}

  @Get()
  async findAll() {
    return this.dynastiesService.findAll();
  }
}
