import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import { PhotoMetadata } from "./PhotoMetadata";
import { Author } from "./Author";
import { Album } from "./Album";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column("text")
  description: string;

  @Column()
  filename: string;

  //   @Column("double")
  views: number;

  @Column()
  isPublished: boolean;

  // no real field in db
  // setup typeorm cascade but its auto save seems not exact CASCADE?
  // https://docs.postgresql.tw/the-sql-language/ddl/constraints
  @OneToOne((type) => PhotoMetadata, (metadata) => metadata.photo)
  metadata: PhotoMetadata;

  // foreign key
  @ManyToOne((type) => Author, (author) => author.photos)
  author: Author;

  @ManyToMany((type) => Album, (album) => album.photos)
  albums: Album[];
}
