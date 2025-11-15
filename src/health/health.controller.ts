import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    constructor() {}
    @Get()
    health(): { status: string; timestamp: string; version: string } {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || 'unknown',
        };
    }
}
