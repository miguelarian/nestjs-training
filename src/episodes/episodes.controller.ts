import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { EpisodesService } from './episodes.service';

@Controller('episodes')
export class EpisodesController {
    private readonly episodesService: EpisodesService;
    constructor(episodesService: EpisodesService) {
        this.episodesService = episodesService;
    }

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
