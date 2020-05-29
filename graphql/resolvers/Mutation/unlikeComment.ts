import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Answer from "../../../entities/Answer";
import Comment from "../../../entities/Comment";
import CommentReaction from "../../../entities/CommentReaction";
import Post from "../../../entities/Post";
import ReactionType from "../../../entities/ReactionType";

export default async (_: any, args: any, context: any) => {
  if (!context.userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  return getConnection().transaction(async (manager) => {
    const comment = await manager.findOne(Comment, args.id, {
      relations: ["answer", "answer.post"],
    });

    if (!comment) {
      throw new UserInputError(`The comment (id: ${args.id}) does not exist.`);
    }

    const answer = comment.answer as Answer;
    const post = answer.post as Post;

    const previousReaction = await manager.findOne(CommentReaction, {
      where: { author: context.userId, comment: args.id },
    });

    if (!previousReaction) {
      throw new UserInputError(
        `You didn't like or dislike the comment (id: ${args.id}).`
      );
    }

    switch (previousReaction.type) {
      case ReactionType.like:
        post.likes -= 1;
        answer.likes -= 1;
        comment.likes -= 1;
        break;
      case ReactionType.dislike:
        post.dislikes -= 1;
        answer.dislikes -= 1;
        comment.dislikes -= 1;
        break;
    }

    await manager.remove(previousReaction);
    await manager.save(answer.post);
    await manager.save(answer);
    await manager.save(comment);

    return true;
  });
};
