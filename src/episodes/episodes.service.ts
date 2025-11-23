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

  async add(episodeDto: EpisodeDto): Promise<Episode> {
    const episode = Episode.create(
      episodeDto.title,
      !!episodeDto.featured,
      episodeDto.publishedAt,
    );

    const createdEpisode = await this.episodesRepository.add(episode);
    this.episodes.push(createdEpisode);
    return createdEpisode;
  }

  async findAll(
    sort: "asc" | "desc" = "asc",
    limit?: number,
  ): Promise<Episode[]> {
    return await this.episodesRepository.findAll(sort, limit);
  }

  async findById(id: string): Promise<Episode | undefined> {
    return await this.episodesRepository.findById(id);
  }

  async findFeatured(): Promise<Episode[]> {
    return await this.episodesRepository.findFeatured();
  }
}
