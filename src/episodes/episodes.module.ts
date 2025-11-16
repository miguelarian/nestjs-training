import { Module } from "@nestjs/common";
import { EpisodesController } from "./episodes.controller";
import { ConfigModule } from "../config/config.module";
import { EpisodesService } from "./episodes.service";
import { IsPositivePipe } from "../pipes/is-positive/is-positive.pipe";
import {
  EpisodesDynamoRepository,
  EpisodesRepositoryToken,
} from "./episodes.repository-dynamo";

@Module({
  imports: [ConfigModule],
  controllers: [EpisodesController],
  providers: [
    EpisodesService,
    IsPositivePipe,
    { provide: EpisodesRepositoryToken, useClass: EpisodesDynamoRepository },
  ],
})
export class EpisodesModule {}
