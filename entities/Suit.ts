/**
 * Represents playing card's suit.
 */
enum Suit {
  spade,
  heart,
  diamond,
  club,
}

export function suitToInt(value: Suit): number {
  return SUITS.indexOf(value);
}

export function intToSuit(value: number): Suit {
  const rank = SUITS[value];

  if (rank === undefined) {
    throw new Error(`the given value (${value}) is out of bound.`);
  }

  return rank;
}

const SUITS = [Suit.spade, Suit.heart, Suit.diamond, Suit.club];

export default Suit;
