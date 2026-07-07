import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PoemsService } from './poems.service';
import { QueryPoemsDto } from './dto/query-poems.dto';

@Controller('api/poems')
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  @Get()
  async findAll(@Query() query: QueryPoemsDto) {
    return this.poemsService.findAll(
      query.page ?? 1,
      query.page_size ?? 20,
    );
  }

  @Get('random')
  async random(
    @Query('author') author?: string,
    @Query('type') type?: string,
    @Query('dynasty') dynasty?: string,
  ) {
    return this.poemsService.findRandom(author, type, dynasty);
  }

  @Get('featured')
  async featured() {
    return this.poemsService.findFeatured();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const poem = await this.poemsService.findOne(id);
    if (!poem) {
      throw new NotFoundException(`诗词 "${id}" 未找到`);
    }
    return poem;
  }
}
