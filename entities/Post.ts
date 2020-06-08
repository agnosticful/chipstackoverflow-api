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
import Answer from "./Answer";
import GameStreetAction, {
  stringToGameStreetAction,
  gameStreetActionToString,
} from "./GameStreetAction";
import PlayingCard, {
  intToPlayingCard,
  playingCardToInt,
  intToPlayingCardPair,
  playingCardPairToInt,
} from "./PlayingCard";
import User, { UserId } from "./User";

export enum GameType {
  cash = "CASH",
  tournament = "TOURNAMENT",
}

@Entity()
export default class Post {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: PostId;

  @Column({ type: "text" })
  title!: PostTitle;

  @Column({ type: "text" })
  body!: PostBody;

  @Column({ type: "enum", enum: GameType })
  gameType!: GameType;

  @Column({ type: "smallint" })
  playerLength!: number;

  @Column({ type: "double precision", array: true })
  playerStackSizes!: number[];

  @Column({
    type: "smallint",
    array: true,
    transformer: {
      from: (value: (number | null)[]) =>
        value.map((v) => (v ? intToPlayingCardPair(v) : null)),
      to: (value: ([PlayingCard, PlayingCard] | null)[]) =>
        value.map((v) => (v ? playingCardPairToInt(...v) : null)),
    },
  })
  playerCards!: [PlayingCard, PlayingCard][];

  @Column({
    type: "smallint",
    array: true,
    transformer: {
      from: (value: number[]) => value.map((v) => intToPlayingCard(v)),
      to: (value: PlayingCard[]) => value.map((v) => playingCardToInt(v)),
    },
  })
  communityCards!: PlayingCard[];

  @Column({ type: "smallint" })
  heroIndex!: number;

  @Column({ type: "double precision" })
  smallBlindSize!: number;

  @Column({ type: "double precision" })
  antiSize!: number;

  @Column({
    type: "text",
    array: true,
    transformer: {
      from: (value: string[]) => value.map((v) => stringToGameStreetAction(v)),
      to: (value: GameStreetAction[]) =>
        value.map((action) => gameStreetActionToString(action)),
    },
  })
  preflopActions!: GameStreetAction[];

  @Column({
    type: "text",
    array: true,
    transformer: {
      from: (value: string[]) => value.map((v) => stringToGameStreetAction(v)),
      to: (value: GameStreetAction[]) =>
        value.map((action) => gameStreetActionToString(action)),
    },
  })
  flopActions!: GameStreetAction[];

  @Column({
    type: "text",
    array: true,
    transformer: {
      from: (value: string[]) => value.map((v) => stringToGameStreetAction(v)),
      to: (value: GameStreetAction[]) =>
        value.map((action) => gameStreetActionToString(action)),
    },
  })
  turnActions!: GameStreetAction[];

  @Column({
    type: "text",
    array: true,
    transformer: {
      from: (value: string[]) => value.map((v) => stringToGameStreetAction(v)),
      to: (value: GameStreetAction[]) =>
        value.map((action) => gameStreetActionToString(action)),
    },
  })
  riverActions!: GameStreetAction[];

  @Column({ type: "integer", default: 0 })
  likes!: number;

  @Column({ type: "integer", default: 0 })
  dislikes!: number;

  @ManyToOne(() => User)
  @JoinColumn()
  author?: User | UserId;

  @OneToMany(() => Answer, (answer) => answer.post)
  @JoinColumn()
  answers?: Answer[];

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly lastUpdatedAt!: Date;
}

export type PostId = string & {
  _PostIdBrand: never;
};

export type PostTitle = string & {
  _PostTitleBrand: never;
};

export type PostBody = string & {
  _PostBodyBrand: never;
};
