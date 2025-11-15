import { Module } from '@nestjs/common';
import { EpisodesController } from './episodes.controller';
import { ConfigModule } from '../config/config.module';
import { EpisodesService } from './episodes.service';

@Module({
    imports: [ConfigModule],
    controllers: [EpisodesController],
    providers: [EpisodesService]
})
export class EpisodesModule {}
