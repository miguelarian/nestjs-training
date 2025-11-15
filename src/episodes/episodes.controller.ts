import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { ConfigService } from '../config/config.service';

@Controller('episodes')
export class EpisodesController {
    constructor(
        private readonly episodesService: EpisodesService,
        private readonly configService: ConfigService,
    ) {}

    @Get()
    async findAll(@Query('sort') sort: 'asc' | 'desc' = 'asc') {
        return await this.episodesService.findAll(sort);
    }

    @Get('featured')
    async findFeatured() {
        return await this.episodesService.findFeatured();
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return await this.episodesService.findById(id);
    }

    @Post()
    @HttpCode(201)
    async create(@Body() episode) {
        return await this.episodesService.add(episode);
    }
}
