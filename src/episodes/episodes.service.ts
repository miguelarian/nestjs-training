import { Injectable } from '@nestjs/common';
import { Episode } from './entities/Episode';
import { IEpisodesService } from './interfaces/IEpisodesService';
import { ConfigService } from '../config/config.service';

@Injectable()
export class EpisodesService implements IEpisodesService {    
    
    private readonly configService: ConfigService;
    private readonly episodes: Episode[] = [];

    constructor(configService: ConfigService) {}

    async add(episode: Episode): Promise<void> {
        this.episodes.push(episode);
    }

    async findAll(sort: 'asc' | 'desc' = 'asc'): Promise<Episode[]> {
        if (sort === 'desc') {
            return [...this.episodes].sort((a, b) => b.id - a.id);
        }
        return [...this.episodes].sort((a, b) => a.id - b.id);
    }

    async findById(id: number): Promise<Episode | undefined> {
        return this.episodes.find(episode => episode.id === id);
    }

    async findFeatured(): Promise<Episode[]> {
        return this.episodes.filter(episode => episode.featured);
    }
}
