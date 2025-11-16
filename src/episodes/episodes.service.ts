/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from "@nestjs/common";
import { Episode } from "./entities/Episode";
import { IEpisodesService } from "./interfaces/IEpisodesService";
import { ConfigService } from "../config/config.service";
import { EpisodeDto } from "./dtos/EpisodeDto";

@Injectable()
export class EpisodesService implements IEpisodesService {
  private readonly configService: ConfigService;
  private readonly episodes: Episode[] = [];

  async add(episodeDto: EpisodeDto): Promise<void> {
    const newEpisode = new Episode(
      this.episodes.concat().length + 1,
      episodeDto.title,
      !!episodeDto.featured,
      episodeDto.publishedAt,
    );
    this.episodes.push(newEpisode);
  }

  async findAll(
    sort: "asc" | "desc" = "asc",
    limit?: number,
  ): Promise<Episode[]> {
    const limitedEpisodes = limit
      ? this.episodes.slice(0, limit)
      : this.episodes;
    if (sort === "desc") {
      return [...limitedEpisodes].sort((a, b) => b.id - a.id);
    }
    return [...limitedEpisodes].sort((a, b) => a.id - b.id);
  }

  async findById(id: number): Promise<Episode | undefined> {
    return this.episodes.find((episode) => episode.id === id);
  }

  async findFeatured(): Promise<Episode[]> {
    return this.episodes.filter((episode) => episode.featured);
  }
}
