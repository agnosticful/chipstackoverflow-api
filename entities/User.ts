import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: UserId;

  @Column({ type: "text" })
  email!: string | null;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  profileImageURL!: string;

  @Column({ type: "text", unique: true })
  authenticationId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export type UserId = string & {
  _UserIdBrand: never;
};
