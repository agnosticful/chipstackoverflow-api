import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import Answer, { AnswerId } from "./Answer";
import User, { UserId } from "./User";
import ReactionType from "./ReactionType";

@Entity()
@Unique(["answer", "author"])
export default class AnswerReaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @ManyToOne(() => Answer)
  answer?: Answer | AnswerId;

  @ManyToOne(() => User)
  author?: User | UserId;

  @Column({ type: "enum", enum: ReactionType })
  type!: ReactionType;

  @CreateDateColumn()
  createdAt!: Date;
}
