import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import Comment, { CommentId } from "./Comment";
import User, { UserId } from "./User";
import ReactionType from "./ReactionType";

@Entity()
@Unique(["comment", "author"])
export default class CommentReaction {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: number;

  @ManyToOne(() => Comment)
  comment?: Comment | CommentId;

  @ManyToOne(() => User)
  author?: User | UserId;

  @Column({ type: "enum", enum: ReactionType })
  type!: ReactionType;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly lastUpdatedAt!: Date;
}
