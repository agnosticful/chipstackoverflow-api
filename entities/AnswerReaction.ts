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
import Answer, { AnswerId } from "./Answer";
import User, { UserId } from "./User";
import ReactionType from "./ReactionType";

@Entity()
@Unique(["answer", "author"])
export default class AnswerReaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: number;

  @ManyToOne(() => Answer)
  answer?: Answer | AnswerId;

  @ManyToOne(() => User)
  author?: User | UserId;

  @Column({ type: "enum", enum: ReactionType })
  type!: ReactionType;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly lastUpdatedAt!: Date;
}
