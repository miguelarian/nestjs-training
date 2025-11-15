import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';

@Controller('episodes')
export class EpisodesController {
    @Get()
    findAll(@Query('sort') sort: 'asc' | 'desc' = 'asc') {
        if (sort === 'desc') {
            return 'This action returns all episodes in descending order';
        }
        return 'This action returns all episodes in ascending order';
    }

    @Get('featured')
    findFeatured() {
        return 'This action returns featured episodes';
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return `This action returns episode with id ${id}`;
    }

    @Post()
    @HttpCode(201)
    create() {
        return 'This action creates a new episode';
    }
}
