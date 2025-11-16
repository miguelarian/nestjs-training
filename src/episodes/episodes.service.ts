/* eslint-disable @typescript-eslint/require-await */
import { Injectable, Inject } from "@nestjs/common";
import { Episode } from "./entities/Episode";
import { IEpisodesService } from "./interfaces/IEpisodesService";
import { EpisodeDto } from "./dtos/EpisodeDto";
import type { IEpisodesRepository } from "./interfaces/IEpisodesRepository";
import { EpisodesRepositoryToken } from "./episodes.repository-dynamo";

@Injectable()
export class EpisodesService implements IEpisodesService {
  private readonly episodes: Episode[] = [];
  private readonly episodesRepository: IEpisodesRepository;

  constructor(
    @Inject(EpisodesRepositoryToken)
    episodesRepository: IEpisodesRepository,
  ) {
    this.episodesRepository = episodesRepository;
  }

  async add(episodeDto: EpisodeDto): Promise<void> {
    const newEpisode = new Episode(
      this.episodes.concat().length + 1,
      episodeDto.title,
      !!episodeDto.featured,
      episodeDto.publishedAt,
    );
    this.episodes.push(newEpisode);
    await this.episodesRepository.add(episodeDto);
  }

  async findAll(
    sort: "asc" | "desc" = "asc",
    limit?: number,
  ): Promise<Episode[]> {
    const all = this.episodes.concat();
    const limitedEpisodes = limit ? all.slice(0, limit) : all;
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
