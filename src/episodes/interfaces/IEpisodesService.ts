import { Episode } from '../entities/Episode';


export interface IEpisodesService {
    add(episode: Episode): void;
    findAll(sort?: 'asc' | 'desc'): Episode[];
    findById(id: number): Episode | undefined;
    findFeatured(): Episode[];
}
