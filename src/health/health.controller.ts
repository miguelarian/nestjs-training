import { Controller, Get } from '@nestjs/common';
import { HealthDto } from './dtos/HealthDto';

@Controller('health')
export class HealthController {
    constructor() {}
    @Get()
    health(): HealthDto {
        const healthDto = new HealthDto();
        healthDto.status = 'ok';
        healthDto.timestamp = new Date().toISOString();
        healthDto.version = process.env.npm_package_version || 'unknown';
        return healthDto;
    }
}
