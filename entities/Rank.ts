/**
 * Represents playing card's rank.
 */
enum Rank {
  ace,
  deuce,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  jack,
  queen,
  king,
}

export function rankToInt(value: Rank): number {
  return RANKS.indexOf(value);
}

export function intToRank(value: number): Rank {
  const rank = RANKS[value];

  if (rank === undefined) {
    throw new Error(`the given value (${value}) is out of bound.`);
  }

  return rank;
}

const RANKS = [
  Rank.ace,
  Rank.deuce,
  Rank.three,
  Rank.four,
  Rank.five,
  Rank.six,
  Rank.seven,
  Rank.eight,
  Rank.nine,
  Rank.ten,
  Rank.jack,
  Rank.queen,
  Rank.king,
];

export default Rank;
