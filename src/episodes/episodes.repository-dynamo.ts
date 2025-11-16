// DynamoDB-backed Episodes repository.
// Usage example (opt-in):
//   @Module({
//     providers: [
//       { provide: EpisodesRepositoryToken, useClass: EpisodesDynamoRepository },
//     ],
//     exports: [EpisodesRepositoryToken],
//   })
//   export class EpisodesPersistenceModule {}
// Then inject with constructor(@Inject(EpisodesRepositoryToken) repo: IEpisodesRepository)
//
// Notes:
// - ID generation currently scans table for the max id then adds 1. This is O(n)
//   and subject to race conditions under concurrency. Prefer one of:
//     * Maintain a separate counter-item with UpdateItem + ConditionExpression
//     * Use ULIDs/UUIDs and store id as string
//     * Use DynamoDB Atomic counters (Update with ADD)
// - findAll & findFeatured use Scan; for production consider GSIs + Query.
// - publishedAt stored as ISO string; mapped back to Date.

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

  async add(episodeDto: EpisodeDto): Promise<void> {
    const newId = await this.generateNextId();

    // Ensure publishedAt is a Date object (handle cases where it might be a string or invalid Date)
    let publishedAt: Date;
    if (
      episodeDto.publishedAt instanceof Date &&
      !Number.isNaN(episodeDto.publishedAt.getTime())
    ) {
      publishedAt = episodeDto.publishedAt;
    } else {
      publishedAt = new Date(episodeDto.publishedAt as string | number | Date);
      if (Number.isNaN(publishedAt.getTime())) {
        throw new TypeError(
          `Invalid publishedAt date: ${String(episodeDto.publishedAt)}`,
        );
      }
    }

    const episode = new Episode(
      newId,
      episodeDto.title,
      !!episodeDto.featured,
      publishedAt,
    );

    try {
      await this.docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: {
            id: episode.id,
            title: episode.title,
            featured: episode.featured,
            publishedAt: episode.publishedAt.toISOString(),
          },
          ConditionExpression: "attribute_not_exists(id)",
        }),
      );
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
    episodes = episodes.sort((a, b) =>
      sort === "desc" ? b.id - a.id : a.id - b.id,
    );
    if (limit) {
      return episodes.slice(0, limit);
    }
    return episodes;
  }

  async findById(id: number): Promise<Episode | undefined> {
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

  private async generateNextId(): Promise<number> {
    // Inefficient full table scan to determine next id.
    const items = await this.scanAll(["id"]);
    let maxId = 0;
    for (const item of items) {
      const id = item["id"];
      if (typeof id === "number" && id > maxId) {
        maxId = id;
      }
    }
    return maxId + 1;
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
    return new Episode(
      item["id"] as number,
      item["title"] as string,
      !!item["featured"],
      new Date(item["publishedAt"] as string),
    );
  };
}
