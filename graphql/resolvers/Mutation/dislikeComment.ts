import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Answer, { AnswerId } from "../../../entities/Answer";
import Comment, { CommentId } from "../../../entities/Comment";
import CommentReaction from "../../../entities/CommentReaction";
import Post, { PostId } from "../../../entities/Post";
import ReactionType from "../../../entities/ReactionType";
import { Context } from "../../context";

export default async (
  _: any,
  { id: commentId }: { id: CommentId },
  { userId }: Context
) => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  return getConnection().transaction(async (manager) => {
    const comment = await manager.findOne(Comment, commentId, {
      lock: { mode: "pessimistic_write" },
      loadRelationIds: {
        relations: ["answer"],
      },
    });

    if (!comment) {
      throw new UserInputError(
        `The comment (id: ${commentId}) does not exist.`
      );
    }

    const answer = await manager.findOne(Answer, comment.answer as AnswerId, {
      lock: { mode: "pessimistic_write" },
      loadRelationIds: {
        relations: ["post"],
      },
    });

    if (!answer) {
      throw new UserInputError(
        `The comment (id: ${commentId}) is in invalid state. The comment itself exists but the bound answer (${comment.answer}) does not exist.`
      );
    }

    const post = await manager.findOne(Post, answer.post as PostId, {
      lock: { mode: "pessimistic_write" },
    });

    if (!post) {
      throw new UserInputError(
        `The comment (id: ${commentId}) or answer (id: ${comment.answer}) is in invalid state. Those two resource themselves exist but the bound post (${answer.post}) does not exist.`
      );
    }

    const previousReaction = await manager.findOne(CommentReaction, {
      where: { author: userId, comment: commentId },
      lock: { mode: "pessimistic_write" },
    });

    if (previousReaction) {
      if (previousReaction.type === ReactionType.dislike) {
        throw new UserInputError(
          `The comment (id: ${commentId}) has already been disliked.`
        );
      }

      post.likes -= 1;
      comment.likes -= 1;

      await manager.remove(previousReaction);
    }

    const reaction = new CommentReaction();
    reaction.type = ReactionType.dislike;
    reaction.author = userId;
    reaction.comment = commentId;

    post.dislikes += 1;
    comment.dislikes += 1;

    await manager.save(post);
    await manager.save(comment);
    await manager.save(reaction);

    return true;
  });
};
