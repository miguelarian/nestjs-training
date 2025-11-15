export class Episode {
    id: number;
    title: string;
    featured: boolean;

    constructor(id: number, title: string, featured: boolean) {
        this.id = id;
        this.title = title;
        this.featured = featured;
    }
}