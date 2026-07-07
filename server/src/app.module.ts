import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PoemsModule } from './poems/poems.module';
import { SearchModule } from './search/search.module';
import { AuthorsModule } from './authors/authors.module';
import { DynastiesModule } from './dynasties/dynasties.module';
import { StatsModule } from './stats/stats.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
    }),
    PoemsModule,
    SearchModule,
    AuthorsModule,
    DynastiesModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
