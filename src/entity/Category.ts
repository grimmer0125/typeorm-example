import {
  Entity,
  Tree,
  Column,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
} from "typeorm";

@Entity()
@Tree("closure-table")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeParent()
  parentCategory: Category;

  @TreeChildren({ cascade: true })
  childCategories: Category[];

  //   @TreeLevelColumn()
  //   level: number;
}
