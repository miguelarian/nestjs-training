import { Injectable, Logger } from "@nestjs/common";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  ScanCommandOutput,
  GetCommandOutput,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { IEpisodesRepository } from "./interfaces/IEpisodesRepository";
import { EpisodeDto } from "./dtos/EpisodeDto";
import { Episode } from "./entities/Episode";

export const EpisodesRepositoryToken = Symbol("EpisodesRepositoryToken");

@Injectable()
export class EpisodesDynamoRepository implements IEpisodesRepository {
  private readonly logger = new Logger(EpisodesDynamoRepository.name);
  private readonly tableName: string;
  private readonly docClient: DynamoDBDocumentClient;

  constructor() {
    const region = process.env.AWS_REGION || "eu-west1"; // default region (unused for local but required by client)
    this.tableName = process.env.EPISODES_TABLE || "Episodes";

    // Support local DynamoDB on port 8000 when DYNAMODB_LOCAL=true or custom endpoint via DYNAMODB_ENDPOINT.
    const isLocal = process.env.DYNAMODB_LOCAL === "true";
    const endpoint =
      process.env.DYNAMODB_ENDPOINT ||
      (isLocal ? "http://localhost:8000" : undefined);

    const client = new DynamoDBClient({
      region,
      ...(endpoint ? { endpoint } : {}),
      // Local DynamoDB still expects credentials object; provide dummy if not set.
      ...(endpoint
        ? {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummy",
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummy",
            },
          }
        : {}),
    });
    this.docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  async add(episodeDto: EpisodeDto): Promise<Episode> {
    const episode = Episode.create(
      episodeDto.title,
      !!episodeDto.featured,
      episodeDto.publishedAt,
    );

    try {
      await this.docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: {
            id: episode.id,
            title: episode.title,
            featured: episode.featured,
            publishedAt: episode.publishedAt.toString(),
          },
          ConditionExpression: "attribute_not_exists(id)",
        }),
      );
      return episode;
    } catch (err: any) {
      // ConditionalCheckFailedException could mean race condition on id.
      this.logger.error(`Failed to put Episode id=${episode.id}`, err as Error);
      throw err;
    }
  }

  async findAll(
    sort: "asc" | "desc" = "asc",
    limit?: number,
  ): Promise<Episode[]> {
    const items = await this.scanAll();
    let episodes = items.map(this.mapItemToEpisode);
    episodes = episodes.sort((a, b) => {
      const aTime = a.publishedAt.getTime();
      const bTime = b.publishedAt.getTime();
      return sort === "desc" ? bTime - aTime : aTime - bTime;
    });
    if (limit) {
      return episodes.slice(0, limit);
    }
    return episodes;
  }

  async findById(id: string): Promise<Episode | undefined> {
    const result: GetCommandOutput = await this.docClient.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    if (!result.Item) return undefined;
    return this.mapItemToEpisode(result.Item as Record<string, unknown>);
  }

  async findFeatured(): Promise<Episode[]> {
    const baseInput: ScanCommandInput = {
      TableName: this.tableName,
      FilterExpression: "featured = :featured",
      ExpressionAttributeValues: { ":featured": true },
    };
    const items: Record<string, unknown>[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined = undefined;
    do {
      const input: ScanCommandInput = ExclusiveStartKey
        ? { ...baseInput, ExclusiveStartKey }
        : baseInput;
      const page: ScanCommandOutput = await this.docClient.send(
        new ScanCommand(input),
      );
      if (page.Items) items.push(...(page.Items as Record<string, unknown>[]));
      ExclusiveStartKey = page.LastEvaluatedKey as
        | Record<string, unknown>
        | undefined;
    } while (ExclusiveStartKey);
    return items.map(this.mapItemToEpisode);
  }

  private async scanAll(
    projectionAttributes?: string[],
  ): Promise<Record<string, unknown>[]> {
    const items: Record<string, unknown>[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined = undefined;
    do {
      const input: ScanCommandInput = {
        TableName: this.tableName,
        ...(projectionAttributes
          ? { ProjectionExpression: projectionAttributes.join(", ") }
          : {}),
        ...(ExclusiveStartKey ? { ExclusiveStartKey } : {}),
      };
      const page: ScanCommandOutput = await this.docClient.send(
        new ScanCommand(input),
      );
      if (page.Items) items.push(...(page.Items as Record<string, unknown>[]));
      ExclusiveStartKey = page.LastEvaluatedKey as
        | Record<string, unknown>
        | undefined;
    } while (ExclusiveStartKey);
    return items;
  }

  private readonly mapItemToEpisode = (
    item: Record<string, unknown>,
  ): Episode => {
    return Episode.fromData(
      item["id"] as string,
      item["title"] as string,
      !!item["featured"],
      new Date(item["publishedAt"] as string),
    );
  };
}
