import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { EpisodesService } from "./episodes.service";
import { ConfigService } from "../config/config.service";
import { IsPositivePipe } from "../pipes/is-positive/is-positive.pipe";
import { EpisodeDto } from "./dtos/EpisodeDto";
import { ApiKeyGuard } from "../guards/api-key.guard";

@UseGuards(ApiKeyGuard)
@Controller("episodes")
export class EpisodesController {
  constructor(
    private readonly episodesService: EpisodesService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async findAll(
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe, IsPositivePipe)
    limit?: number,
    @Query("sort") sort: "asc" | "desc" = "asc",
  ) {
    return await this.episodesService.findAll(sort, limit);
  }

  @Get("featured")
  async findFeatured() {
    return await this.episodesService.findFeatured();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    const episode = await this.episodesService.findById(id);
    if (!episode) {
      throw new NotFoundException("Episode not found");
    }
    return episode;
  }

  @Post()
  @HttpCode(201)
  async create(@Body(ValidationPipe) episode: EpisodeDto) {
    return await this.episodesService.add(episode);
  }
}
