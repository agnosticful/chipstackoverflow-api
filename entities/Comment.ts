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
import Answer from "./Answer";
import CommentReaction from "./CommentReaction";
import User from "./User";

@Entity()
export default class Comment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "integer", default: 0 })
  likes!: number;

  @Column({ type: "integer", default: 0 })
  dislikes!: number;

  @OneToMany(() => CommentReaction, (reaction) => reaction.comment)
  @JoinColumn()
  reactions!: CommentReaction[];

  @ManyToOne(() => Answer)
  @JoinColumn()
  answer!: Answer;

  @ManyToOne(() => User)
  @JoinColumn()
  author!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
