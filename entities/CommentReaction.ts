import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import Comment from "./Comment";
import User from "./User";
import ReactionType from "./ReactionType";

@Entity()
@Unique(["comment", "author"])
export default class CommentReaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: number;

  @ManyToOne(() => Comment)
  comment!: Comment;

  @ManyToOne(() => User)
  author!: User;

  @Column({ type: "enum", enum: ReactionType })
  type!: ReactionType;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly lastUpdatedAt!: Date;
}
