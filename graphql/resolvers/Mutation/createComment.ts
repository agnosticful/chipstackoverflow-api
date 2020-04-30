import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import Answer from "../../../entities/Answer";
import Comment from "../../../entities/Comment";

export default async (_: any, args: any, context: any) => {
  if (!context.userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  if (!(await Answer.findOne(args.answerId))) {
    throw new UserInputError(`Answer (id: ${args.answerId}) is not found.`);
  }

  const comment = new Comment();
  comment.body = args.body;
  comment.answer = args.answerId;
  comment.author = context.userId;

  try {
    await comment.save();
  } catch (err) {
    console.error(err);
  }

  return comment;
};
