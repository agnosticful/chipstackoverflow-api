import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import AnswerReaction from "./AnswerReaction";
import Comment from "./Comment";
import Post, { PostId } from "./Post";
import User, { UserId } from "./User";

@Entity()
export default class Answer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: AnswerId;

  @Column({ type: "text" })
  body!: AnswerBody;

  @Column({ type: "integer", default: 0 })
  likes!: number;

  @Column({ type: "integer", default: 0 })
  dislikes!: number;

  @OneToMany(() => AnswerReaction, (reaction) => reaction.answer)
  @JoinColumn()
  reactions?: AnswerReaction[];

  @OneToMany(() => Comment, (comment) => comment.answer)
  @JoinColumn()
  comments?: Comment[];

  @ManyToOne(() => User)
  @JoinColumn()
  author?: User | UserId;

  @ManyToOne(() => Post)
  @JoinColumn()
  post?: Post | PostId;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;
}

export type AnswerId = string & {
  _AnswerIdBrand: never;
};

export type AnswerBody = string & {
  _AnswerBodyBrand: never;
};

export function assertAnswerBody(
  value: string,
  name: string = "value"
): asserts value is AnswerBody {
  if (value.length < 8) {
    throw new Error(
      `${name} is too short. ${name} needs to be a 8-65535-length string.`
    );
  }

  if (value.length > 65535) {
    throw new Error(
      `${name} is too long. ${name} needs to be a 8-65535-length string.`
    );
  }
}
