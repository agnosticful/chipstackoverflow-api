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
import User from "./User";

enum GameType {
  cash = "CASH",
  tournament = "TOURNAMENT",
}

@Entity()
export default class Post extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text" })
  body!: string;

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
      from: (value: number[]) =>
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
      from: (value: (number | null)[]) =>
        value.map((v) => (v ? intToPlayingCard(v) : null)),
      to: (value: (PlayingCard | null)[]) =>
        value.map((v) => (v ? playingCardToInt(v) : null)),
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
  author!: User;

  @OneToMany(() => Answer, (answer) => answer.post)
  @JoinColumn()
  answers!: Answer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
