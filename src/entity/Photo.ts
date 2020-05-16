import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { PhotoMetadata } from "./PhotoMetadata";

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

  // setup typeorm cascade but its auto save seems not exact CASCADE?
  // https://docs.postgresql.tw/the-sql-language/ddl/constraints
  @OneToOne((type) => PhotoMetadata, (metadata) => metadata.photo, {
    cascade: true,
  })
  metadata: PhotoMetadata;
}
