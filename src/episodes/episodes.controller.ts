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
    findAll(@Query('sort') sort: 'asc' | 'desc' = 'asc') {
        return this.episodesService.findAll(sort);
    }

    @Get('featured')
    findFeatured() {
        return this.episodesService.findFeatured();
    }

    @Get(':id')
    findById(@Param('id') id: number) {
        return this.episodesService.findById(id);
    }

    @Post()
    @HttpCode(201)
    create(@Body() episode) {
        return this.episodesService.add(episode);
    }
}
