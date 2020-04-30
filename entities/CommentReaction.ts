import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import Comment from "./Comment";
import User from "./User";
import ReactionType from "./ReactionType";

@Entity()
@Unique(["comment", "author"])
export default class CommentReaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @ManyToOne(() => Comment)
  comment!: Comment;

  @ManyToOne(() => User)
  author!: User;

  @Column({ type: "enum", enum: ReactionType })
  type!: ReactionType;

  @CreateDateColumn()
  createdAt!: Date;
}
