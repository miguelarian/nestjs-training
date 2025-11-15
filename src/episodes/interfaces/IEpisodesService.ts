import { Episode } from '../entities/Episode';


export interface IEpisodesService {
    add(episode: Episode): Promise<void>;
    findAll(sort?: 'asc' | 'desc'): Promise<Episode[]>;
    findById(id: number): Promise<Episode | undefined>;
    findFeatured(): Promise<Episode[]>;
}
