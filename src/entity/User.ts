import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({ default: 1, nullable: false })
  price: number;

  @Column({ nullable: true }) // default is null
  nick: number;

  @Column({ nullable: true }) // default is null
  bad: number;
}
