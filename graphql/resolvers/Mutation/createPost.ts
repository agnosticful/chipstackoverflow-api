import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import PlayingCard from "../../../entities/PlayingCard";
import Post, { GameType } from "../../../entities/Post";
import GameStreetAction from "../../../entities/GameStreetAction";
import { Context } from "../../context";

export default async (
  _: any,
  {
    title,
    body,
    gameType,
    playerLength,
    playerStackSizes,
    playerCards,
    communityCards,
    heroIndex,
    smallBlindSize,
    antiSize,
    preflopActions,
    flopActions,
    turnActions,
    riverActions,
  }: {
    title: string;
    body: string;
    gameType: GameType;
    playerLength: number;
    playerStackSizes: number[];
    playerCards: [PlayingCard, PlayingCard][];
    communityCards: PlayingCard[];
    heroIndex: number;
    smallBlindSize: number;
    antiSize: number;
    preflopActions: GameStreetAction[];
    flopActions: GameStreetAction[];
    turnActions: GameStreetAction[];
    riverActions: GameStreetAction[];
  },
  { userId }: Context
) => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  validateTitle(title);
  validateBody(body);
  validatePlayerLength(playerLength);
  validatePlayerStackSizes({ playerStackSizes, playerLength });
  validatePlayerCards({ playerCards, playerLength });
  validateCommunityCards(communityCards);
  validateHeroIndex({ heroIndex, playerLength });
  validateSmallBlindSize(smallBlindSize);
  validateAntiSize(antiSize);

  // TODO: add validations for actions

  return await getConnection()
    .getRepository(Post)
    .create({
      title: title,
      body: body,
      gameType: gameType,
      playerLength: playerLength,
      playerStackSizes: playerStackSizes,
      playerCards: playerCards,
      communityCards: communityCards,
      heroIndex: heroIndex,
      smallBlindSize: smallBlindSize,
      antiSize: antiSize,
      preflopActions: preflopActions,
      flopActions: flopActions,
      turnActions: turnActions,
      riverActions: riverActions,
      author: userId,
    })
    .save();
};

function validateTitle(title: string): void {
  if (title.trim() !== title) {
    throw new UserInputError(
      `title is invalid. title must not include whitespace characters at the head or tail.`
    );
  }

  if (title.length < 8 || title.length > 65535) {
    throw new UserInputError(
      `title is invalid. title must be 8 to 65535 character length.`
    );
  }
}

function validateBody(body: string): void {
  if (body.trim() !== body) {
    throw new UserInputError(
      "body is invalid. body must not include whitespace characters at the head or tail."
    );
  }

  if (body.length < 8 || body.length > 65535) {
    throw new UserInputError(
      "body is invalid. body must be 8 to 65535 character length."
    );
  }
}

function validatePlayerLength(playerLength: number): void {
  if (playerLength < 0 || playerLength > 10) {
    throw new UserInputError(
      "playerLength is invalid. playerLength must be a positive integer and less or equal than 10."
    );
  }
}

function validatePlayerStackSizes({
  playerStackSizes,
  playerLength,
}: {
  playerStackSizes: number[];
  playerLength: number;
}): void {
  if (playerStackSizes.length !== playerLength) {
    throw new UserInputError(
      "playerStackSizes is invalid. its length must be the same with playerLength."
    );
  }

  for (const [i, value] of playerStackSizes.entries()) {
    if (value <= 0) {
      throw new UserInputError(
        `playerStackSizes[${i}] is invalid. Each item in playerStackSizes must be positive number.`
      );
    }
  }
}

function validatePlayerCards({
  playerCards,
  playerLength,
}: {
  playerCards: [PlayingCard, PlayingCard][];
  playerLength: number;
}): void {
  if (playerCards.length !== playerLength) {
    throw new UserInputError(
      "playerCards is invalid. its length must be the same with playerLength."
    );
  }

  for (const [i, value] of playerCards.entries()) {
    if (value !== null && value.length !== 2) {
      throw new UserInputError(
        `playerCards[${i}] is invalid. Each item in playerCards must be null or a pair of playing cards.`
      );
    }
  }
}

function validateCommunityCards(communityCards: PlayingCard[]): void {
  if (![0, 3, 4, 5].includes(communityCards.length)) {
    throw new UserInputError(
      "communityCards is invalid. The length of communityCards must be 0, 3, 4 or 5."
    );
  }
}

function validateHeroIndex({
  heroIndex,
  playerLength,
}: {
  heroIndex: number;
  playerLength: number;
}): void {
  if (heroIndex < 0 || heroIndex >= playerLength) {
    throw new UserInputError(
      "heroIndex is invalid. heroIndex must be a positive integer less than playerLength."
    );
  }
}

function validateSmallBlindSize(smallBlindSize: number): void {
  if (smallBlindSize <= 0 || smallBlindSize >= 1) {
    throw new UserInputError(
      "smallBlindSize is invalid. smallBlindSize must be greater than 0 and less than 1."
    );
  }
}

function validateAntiSize(antiSize: number): void {
  if (antiSize < 0 || antiSize >= 1) {
    throw new UserInputError(
      "antiSize is invalid. antiSize must be a positive number less than 1."
    );
  }
}
