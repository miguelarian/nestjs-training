import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  get episodesTableName(): string {
    return "Episodes";
  }
}
