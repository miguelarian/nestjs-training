import { Injectable } from '@nestjs/common';
import { Episode } from './entities/Episode';
import { IEpisodesService } from './interfaces/IEpisodesService';

@Injectable()
export class EpisodesService implements IEpisodesService {    
    private readonly episodes: Episode[] = [];

    add(episode: Episode): void {
        this.episodes.push(episode);
    }

    findAll(sort: 'asc' | 'desc' = 'asc'): Episode[] {
        if (sort === 'desc') {
            return [...this.episodes].sort((a, b) => b.id - a.id);
        }
        return [...this.episodes].sort((a, b) => a.id - b.id);
    }

    findById(id: number): Episode | undefined {
        return this.episodes.find(episode => episode.id === id);
    }

    findFeatured(): Episode[] {
        return this.episodes.filter(episode => episode.featured);
    }
}
