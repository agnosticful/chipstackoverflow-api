import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import Comment, { CommentId } from "./Comment";
import User, { UserId } from "./User";
import ReactionType from "./ReactionType";

@Entity()
@Unique(["comment", "author"])
export default class CommentReaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @ManyToOne(() => Comment)
  comment?: Comment | CommentId;

  @ManyToOne(() => User)
  author?: User | UserId;

  @Column({ type: "enum", enum: ReactionType })
  type!: ReactionType;

  @CreateDateColumn()
  createdAt!: Date;
}
