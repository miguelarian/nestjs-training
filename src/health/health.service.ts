import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  health(): { status: string; version: string } {
    return {
      status: "ok",
      version: process.env.npm_package_version || "unknown",
    };
  }
}
