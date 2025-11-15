import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsDate } from 'class-validator';

export class EpisodeDto {
    @IsString()
    title: string;

    @IsBoolean()
    @IsOptional()
    featured?: boolean;

    @IsDate()
    @Type(() => Date)
    publishedAt: Date;

    public constructor(init?: Partial<EpisodeDto>) {
        Object.assign(this, init);
    }
}