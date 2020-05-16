import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /** mongo may use embedded data array to implement*/
  // ref1: https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/
  //     p.s. its Subset Pattern is a kind of denormalization
  // ref2: https://docs.parseplatform.org/parse-server/guide/
  // ref3: two more denormalization ref about nosql
  // https://firebase.google.com/docs/database/web/structure-data
  // https://docs.parseplatform.org/js/guide/#using-arrays
  // no real fields in db
  @OneToMany((type) => Photo, (photo) => photo.author)
  photos: Photo[];
}
