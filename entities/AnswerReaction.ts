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
import Answer from "./Answer";
import User from "./User";
import ReactionType from "./ReactionType";

@Entity()
@Unique(["answer", "author"])
export default class AnswerReaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: number;

  @ManyToOne(() => Answer)
  answer!: Answer;

  @ManyToOne(() => User)
  author!: User;

  @Column({ type: "enum", enum: ReactionType })
  type!: ReactionType;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly lastUpdatedAt!: Date;
}
