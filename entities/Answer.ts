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
import Post from "./Post";
import User from "./User";

@Entity()
export default class Answer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "integer", default: 0 })
  likes!: number;

  @Column({ type: "integer", default: 0 })
  dislikes!: number;

  @OneToMany(() => AnswerReaction, (reaction) => reaction.answer)
  @JoinColumn()
  reactions!: AnswerReaction[];

  @OneToMany(() => Comment, (comment) => comment.answer)
  @JoinColumn()
  comments!: Comment[];

  @ManyToOne(() => User)
  @JoinColumn()
  author!: User;

  @ManyToOne(() => Post)
  @JoinColumn()
  post!: Post;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
