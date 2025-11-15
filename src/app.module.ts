import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { EpisodesController } from './episodes/episodes.controller';
import { EpisodesModule } from './episodes/episodes.module';
import { ConfigModule } from './config/config.module';
import { EpisodesService } from './episodes/episodes.service';

@Module({
  imports: [HealthModule, EpisodesModule, ConfigModule],
  controllers: [AppController, EpisodesController],
  providers: [AppService, EpisodesService],
})
export class AppModule {}
