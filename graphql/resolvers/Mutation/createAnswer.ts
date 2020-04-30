import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import Answer from "../../../entities/Answer";
import Post from "../../../entities/Post";

export default async (_: any, args: any, context: any) => {
  if (!context.userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  if (!(await Post.findOne(args.postId))) {
    throw new UserInputError(`Post (id: ${args.postId}) is not found.`);
  }

  const answer = new Answer();
  answer.body = args.body;
  answer.post = args.postId;
  answer.author = context.userId;

  try {
    await answer.save();
  } catch (err) {
    console.error(err);
  }

  return answer;
};
