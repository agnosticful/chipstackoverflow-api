import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import Answer from "./Answer";
import User from "./User";
import ReactionType from "./ReactionType";

@Entity()
@Unique(["answer", "author"])
export default class AnswerReaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @ManyToOne(() => Answer)
  answer!: Answer;

  @ManyToOne(() => User)
  author!: User;

  @Column({ type: "enum", enum: ReactionType })
  type!: ReactionType;

  @CreateDateColumn()
  createdAt!: Date;
}
