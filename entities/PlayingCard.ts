import Rank, { rankToInt, intToRank } from "./Rank";
import Suit, { suitToInt, intToSuit } from "./Suit";

export default interface PlayingCard {
  rank: Rank;
  suit: Suit;
}

export function playingCardToInt({ rank, suit }: PlayingCard): number {
  return rankToInt(rank) + suitToInt(suit) * 13;
}

export function intToPlayingCard(value: number): PlayingCard {
  return {
    rank: intToRank(value % 13),
    suit: intToSuit(Math.floor(value / 13)),
  };
}

export function playingCardPairToInt(a: PlayingCard, b: PlayingCard): number {
  return playingCardToInt(a) * 52 + playingCardToInt(b);
}

export function intToPlayingCardPair(
  value: number
): [PlayingCard, PlayingCard] {
  return [
    intToPlayingCard(Math.floor(value / 52)),
    intToPlayingCard(value % 52),
  ];
}
