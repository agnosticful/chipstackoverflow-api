import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Comment, { CommentId } from "../../../entities/Comment";
import CommentReaction from "../../../entities/CommentReaction";
import ReactionType from "../../../entities/ReactionType";
import Answer, { AnswerId } from "../../../entities/Answer";
import Post, { PostId } from "../../../entities/Post";
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
    const comment = await manager.getRepository(Comment).findOne(commentId, {
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

    const answer = await manager
      .getRepository(Answer)
      .findOne(comment.answer as AnswerId, {
        lock: { mode: "pessimistic_write" },
        loadRelationIds: {
          relations: ["post"],
        },
      });

    if (!answer) {
      throw new UserInputError(
        `The comment (id: ${comment.id}) is in invalid state. The comment itself exists but the bound answer (${comment.answer}) does not exist.`
      );
    }

    const post = await manager
      .getRepository(Post)
      .findOne(answer.post as PostId, {
        lock: { mode: "pessimistic_write" },
      });

    if (!post) {
      throw new UserInputError(
        `The comment (id: ${comment.id}) or answer (id: ${comment.answer}) is in invalid state. Those two resource themselves exist but the bound post (${answer.post}) does not exist.`
      );
    }

    const previousReaction = await manager
      .getRepository(CommentReaction)
      .findOne({
        where: { author: userId, comment: comment.id },
        lock: { mode: "pessimistic_write" },
      });

    if (previousReaction) {
      if (previousReaction.type === ReactionType.like) {
        throw new UserInputError(
          `The comment (id: ${comment.id}) has already been liked.`
        );
      }

      await Promise.all([
        manager.getRepository(Post).decrement({ id: post.id }, "dislikes", 1),
        manager
          .getRepository(Comment)
          .decrement({ id: comment.id }, "dislikes", 1),
        manager.getRepository(CommentReaction).delete(previousReaction.id),
      ]);
    }

    await Promise.all([
      manager.getRepository(Post).increment({ id: post.id }, "likes", 1),
      manager.getRepository(Comment).increment({ id: comment.id }, "likes", 1),
      manager.getRepository(CommentReaction).insert({
        type: ReactionType.like,
        author: userId,
        comment: comment.id,
      }),
    ]);

    return true;
  });
};
