import { v4 as uuidv4 } from "uuid";

export class Episode {
  id: string;
  title: string;
  featured: boolean;
  publishedAt: Date;

  // Private constructor with all properties
  private constructor(
    id: string,
    title: string,
    featured: boolean,
    publishedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.featured = featured;
    this.publishedAt = publishedAt;
  }

  // Static factory method for creating new episodes (3 params)
  static create(title: string, featured: boolean, publishedAt: Date): Episode {
    return new Episode(uuidv4(), title, featured, publishedAt);
  }

  // Static factory method for reconstructing existing episodes (4 params)
  static fromData(
    id: string,
    title: string,
    featured: boolean,
    publishedAt: Date,
  ): Episode {
    return new Episode(id, title, featured, publishedAt);
  }
}
