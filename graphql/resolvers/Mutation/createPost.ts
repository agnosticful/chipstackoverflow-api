import { AuthenticationError } from "apollo-server-fastify";
import Post from "../../../entities/Post";

export default async (_: any, args: any, context: any) => {
  if (!context.userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  console.log(args.playerCards);
  console.log(args.communityCards);

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
  post.answers = [];

  try {
    await post.save();
  } catch (err) {
    console.error(err);
  }

  return post;
};
