import { Module, Provider } from "@nestjs/common";
import { EpisodesController } from "./episodes.controller";
import { ConfigModule, ConfigService } from "../config";
import { EpisodesService } from "./episodes.service";
import { IsPositivePipe } from "../pipes/is-positive/is-positive.pipe";
import {
  EpisodesDynamoRepository,
  EpisodesRepositoryToken,
} from "./episodes.repository-dynamo";

const episodesRepositoryProvider: Provider = {
  provide: EpisodesRepositoryToken,
  useFactory: (configService: ConfigService) => {
    return new EpisodesDynamoRepository(configService.episodesTableName);
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  controllers: [EpisodesController],
  providers: [EpisodesService, IsPositivePipe, episodesRepositoryProvider],
})
export class EpisodesModule {}
