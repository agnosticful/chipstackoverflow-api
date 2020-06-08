import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Answer, { AnswerId } from "../../../entities/Answer";
import AnswerReaction from "../../../entities/AnswerReaction";
import Post, { PostId } from "../../../entities/Post";
import ReactionType from "../../../entities/ReactionType";
import User from "../../../entities/User";
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
    const [user, answer] = await Promise.all([
      manager.getRepository(User).findOne(userId, {
        lock: { mode: "pessimistic_read" },
      }),
      manager.getRepository(Answer).findOne(answerId, {
        lock: { mode: "pessimistic_write" },
        loadRelationIds: {
          relations: ["post"],
        },
      }),
    ]);

    if (!user) {
      throw new ForbiddenError(
        "Your user data needs to exist to create an answer."
      );
    }

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
      if (previousReaction.type === ReactionType.dislike) {
        throw new UserInputError(
          `The answer (id: ${answer.id}) has already been disliked.`
        );
      }

      await Promise.all([
        await manager
          .getRepository(Post)
          .decrement({ id: post.id }, "likes", 1),
        await manager
          .getRepository(Answer)
          .decrement({ id: answer.id }, "likes", 1),
        await manager.getRepository(AnswerReaction).delete(previousReaction.id),
      ]);
    }

    await Promise.all([
      manager
        .getRepository(Post)
        .increment({ id: answer.post as PostId }, "dislikes", 1),
      manager.getRepository(Answer).increment({ id: answer.id }, "dislikes", 1),
      manager.getRepository(AnswerReaction).insert({
        type: ReactionType.dislike,
        author: userId,
        answer: answer.id,
      }),
    ]);

    return true;
  });
};
