import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Answer, { AnswerId } from "./Answer";
import CommentReaction from "./CommentReaction";
import User, { UserId } from "./User";

@Entity()
export default class Comment {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: CommentId;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "integer", default: 0 })
  likes!: number;

  @Column({ type: "integer", default: 0 })
  dislikes!: number;

  @OneToMany(() => CommentReaction, (reaction) => reaction.comment)
  @JoinColumn()
  reactions?: CommentReaction[];

  @ManyToOne(() => Answer)
  @JoinColumn()
  answer?: Answer | AnswerId;

  @ManyToOne(() => User)
  @JoinColumn()
  author?: User | UserId;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly lastUpdatedAt!: Date;
}

export type CommentId = string & {
  _CommentIdBrand: never;
};

export type CommentBody = string & {
  _CommentBodyBrand: never;
};
