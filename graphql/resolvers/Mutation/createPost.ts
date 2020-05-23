import { UserInputError } from "apollo-server-fastify";
import Post from "../../../entities/Post";
import requireAuthenticated from "../common/requireAuthenticated";

export default async (_: any, args: any, context: any) => {
  requireAuthenticated(context);

  validateTitle(args);
  validateBody(args);
  validatePlayerLength(args);
  validatePlayerStackSizes(args);
  validatePlayerCards(args);
  validateCommunityCards(args);
  validateHeroIndex(args);
  validateSmallBlindSize(args);
  validateAntiSize(args);

  // TODO: add validations for actions

  const post = new Post();
  post.title = args.title;
  post.body = args.body;
  post.gameType = args.gameType;
  post.playerLength = args.playerLength;
  post.playerStackSizes = args.playerStackSizes;
  post.playerCards = args.playerCards;
  post.communityCards = args.communityCards;
  post.heroIndex = args.heroIndex;
  post.smallBlindSize = args.smallBlindSize;
  post.antiSize = args.antiSize;
  post.preflopActions = args.preflopActions;
  post.flopActions = args.flopActions;
  post.turnActions = args.turnActions;
  post.riverActions = args.riverActions;
  post.author = context.userId;

  await post.save();

  return post;
};

function validateTitle(args: any) {
  if (args.title.trim() !== args.title) {
    throw new UserInputError(
      `title is invalid. title must not include whitespace characters at the head or tail.`
    );
  }

  if (args.title.length < 8 || args.title.length > 65535) {
    throw new UserInputError(
      `title is invalid. title must be 8 to 65535 character length.`
    );
  }
}

function validateBody(args: any) {
  if (args.body.trim() !== args.body) {
    throw new UserInputError(
      "body is invalid. body must not include whitespace characters at the head or tail."
    );
  }

  if (args.body.length < 8 || args.body.length > 65535) {
    throw new UserInputError(
      "body is invalid. body must be 8 to 65535 character length."
    );
  }
}

function validatePlayerLength(args: any) {
  if (args.playerLength < 0 || args.playerLength > 10) {
    throw new UserInputError(
      "playerLength is invalid. playerLength must be a positive integer and less or equal than 10."
    );
  }
}

function validatePlayerStackSizes(args: any) {
  if (args.playerStackSizes.length !== args.playerLength) {
    throw new UserInputError(
      "playerStackSizes is invalid. its length must be the same with playerLength."
    );
  }

  for (const [i, value] of args.playerStackSizes.entries()) {
    if (value <= 0) {
      throw new UserInputError(
        `playerStackSizes[${i}] is invalid. Each item in playerStackSizes must be positive number.`
      );
    }
  }
}

function validatePlayerCards(args: any) {
  if (args.playerCards.length !== args.playerLength) {
    throw new UserInputError(
      "playerCards is invalid. its length must be the same with playerLength."
    );
  }

  for (const [i, value] of args.playerCards.entries()) {
    if (value !== null && value.length !== 2) {
      throw new UserInputError(
        `playerCards[${i}] is invalid. Each item in playerCards must be null or a pair of playing cards.`
      );
    }
  }
}

function validateCommunityCards(args: any) {
  if (![0, 3, 4, 5].includes(args.communityCards.length)) {
    throw new UserInputError(
      "communityCards is invalid. The length of communityCards must be 0, 3, 4 or 5."
    );
  }
}

function validateHeroIndex(args: any) {
  if (args.heroIndex < 0 || args.heroIndex >= args.playerLength) {
    throw new UserInputError(
      "heroIndex is invalid. heroIndex must be a positive integer less than playerLength."
    );
  }
}

function validateSmallBlindSize(args: any) {
  if (args.smallBlindSize <= 0 || args.smallBlindSize >= 1) {
    throw new UserInputError(
      "smallBlindSize is invalid. smallBlindSize must be greater than 0 and less than 1."
    );
  }
}

function validateAntiSize(args: any) {
  if (args.antiSize < 0 || args.antiSize >= 1) {
    throw new UserInputError(
      "antiSize is invalid. antiSize must be a positive number less than 1."
    );
  }
}
