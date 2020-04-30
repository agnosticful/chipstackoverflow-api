import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Comment from "../../../entities/Comment";
import CommentReaction from "../../../entities/CommentReaction";
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

    const previousReaction = await manager.findOne(CommentReaction, {
      where: { author: context.userId, comment: args.id },
    });

    if (previousReaction) {
      if (previousReaction.type === ReactionType.dislike) {
        throw new UserInputError(
          `The comment (id: ${args.id}) has already been disliked.`
        );
      }

      comment.answer.post.likes -= 1;
      comment.answer.likes -= 1;
      comment.likes -= 1;

      await manager.remove(previousReaction);
    }

    const reaction = new CommentReaction();
    reaction.type = ReactionType.dislike;
    reaction.author = context.userId;
    reaction.comment = args.id;

    comment.answer.post.dislikes += 1;
    comment.answer.dislikes += 1;
    comment.dislikes += 1;

    await manager.save(comment.answer.post);
    await manager.save(comment.answer);
    await manager.save(comment);
    await manager.save(reaction);

    return true;
  });
};
