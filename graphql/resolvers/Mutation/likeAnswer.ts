import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Answer, { AnswerId } from "../../../entities/Answer";
import AnswerReaction from "../../../entities/AnswerReaction";
import Post, { PostId } from "../../../entities/Post";
import ReactionType from "../../../entities/ReactionType";
import { Context } from "../../context";

export default async (
  _: any,
  { id: answerId }: { id: AnswerId },
  { userId }: Context
) => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  return getConnection().transaction(async (manager) => {
    const answer = await manager.getRepository(Answer).findOne(answerId, {
      lock: { mode: "pessimistic_write" },
      loadRelationIds: {
        relations: ["post"],
      },
    });

    if (!answer) {
      throw new UserInputError(`The answer (id: ${answerId}) does not exist.`);
    }

    const post = await manager
      .getRepository(Post)
      .findOne(answer.post as PostId, {
        lock: { mode: "pessimistic_write" },
      });

    if (!post) {
      throw new UserInputError(
        `The answer (id: ${answer.id}) is in invalid state. The answer itself exists but the bound post (${answer.post}) does not exist.`
      );
    }

    const previousReaction = await manager
      .getRepository(AnswerReaction)
      .findOne({
        where: { author: userId, answer: answer.id },
        lock: { mode: "pessimistic_write" },
      });

    if (previousReaction) {
      if (previousReaction.type === ReactionType.like) {
        throw new UserInputError(
          `The answer (id: ${answer.id}) has already been liked.`
        );
      }

      await Promise.all([
        await manager
          .getRepository(Post)
          .decrement({ id: post.id }, "dislikes", 1),
        await manager
          .getRepository(Answer)
          .decrement({ id: answer.id }, "dislikes", 1),
        await manager.getRepository(AnswerReaction).delete(previousReaction.id),
      ]);
    }

    await Promise.all([
      manager
        .getRepository(Post)
        .increment({ id: answer.post as PostId }, "likes", 1),
      manager.getRepository(Answer).increment({ id: answer.id }, "likes", 1),
      manager.getRepository(AnswerReaction).insert({
        type: ReactionType.like,
        author: userId,
        answer: answer.id,
      }),
    ]);

    return true;
  });
};
