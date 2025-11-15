import { Body, Controller, Get, HttpCode, NotFoundException, Param, Post, Query } from '@nestjs/common';
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
        const episode = await this.episodesService.findById(Number(id));
        if (!episode) {
            throw new NotFoundException('Episode not found');
        }
        return episode;
    }

    @Post()
    @HttpCode(201)
    async create(@Body() episode) {
        return await this.episodesService.add(episode);
    }
}
