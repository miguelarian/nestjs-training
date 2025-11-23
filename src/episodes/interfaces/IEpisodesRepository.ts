import { Episode } from "../entities/Episode";

export interface IEpisodesRepository {
  add(episode: Episode): Promise<Episode>;
  findAll(sort?: "asc" | "desc", limit?: number): Promise<Episode[]>;
  findById(id: string): Promise<Episode | undefined>;
  findFeatured(): Promise<Episode[]>;
}
