import { EpisodeDto } from "../dtos/EpisodeDto";
import { Episode } from "../entities/Episode";

export interface IEpisodesRepository {
  add(episode: EpisodeDto): Promise<void>;
  findAll(sort?: "asc" | "desc", limit?: number): Promise<Episode[]>;
  findById(id: number): Promise<Episode | undefined>;
  findFeatured(): Promise<Episode[]>;
}
