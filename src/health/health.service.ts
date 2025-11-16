import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  health(): { status: string; timestamp: string; version: string } {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "unknown",
    };
  }
}
