import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: UserId;

  @Column({ type: "text" })
  email!: string | null;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  profileImageURL!: string;

  @Column({ type: "text", unique: true })
  authenticationId!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly lastUpdatedAt!: Date;
}

export type UserId = string & {
  _UserIdBrand: never;
};
