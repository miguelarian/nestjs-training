import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./health/health.module";
import { EpisodesModule } from "./episodes/episodes.module";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [HealthModule, EpisodesModule, ConfigModule],
  controllers: [AppController], // EpisodesController provided by EpisodesModule
  providers: [AppService], // EpisodesService & ConfigService provided by their modules
})
export class AppModule {}
