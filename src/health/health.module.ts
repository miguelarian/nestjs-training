import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { ConfigModule } from 'src/config/config.module';

@Module({
    imports: [ConfigModule],
    providers: [HealthService],
    exports: [HealthService],
    controllers: [HealthController],
})
export class HealthModule {}
