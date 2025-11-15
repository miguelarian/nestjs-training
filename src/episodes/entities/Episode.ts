export class Episode {
    id: number;
    title: string;
    featured: boolean;
    publishedAt: Date;

    constructor(id: number, title: string, featured: boolean, publishedAt: Date) {
        this.id = id;
        this.title = title;
        this.featured = featured;
        this.publishedAt = publishedAt;
    }
}