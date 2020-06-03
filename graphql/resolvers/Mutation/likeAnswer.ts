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
    const answer = await manager.findOne(Answer, answerId, {
      lock: { mode: "pessimistic_write" },
      loadRelationIds: {
        relations: ["post"],
      },
    });

    if (!answer) {
      throw new UserInputError(`The answer (id: ${answerId}) does not exist.`);
    }

    const post = await manager.findOne(Post, answer.post as PostId, {
      lock: { mode: "pessimistic_write" },
    });

    if (!post) {
      throw new UserInputError(
        `The answer (id: ${answerId}) is in invalid state. The answer itself exists but the bound post (${answer.post}) does not exist.`
      );
    }

    const previousReaction = await manager.findOne(AnswerReaction, {
      where: { author: userId, answer: answerId },
      lock: { mode: "pessimistic_write" },
    });

    if (previousReaction) {
      if (previousReaction.type === ReactionType.like) {
        throw new UserInputError(
          `The answer (id: ${answerId}) has already been liked.`
        );
      }

      post.dislikes -= 1;
      answer.dislikes -= 1;

      await manager.remove(previousReaction);
    }

    const reaction = new AnswerReaction();
    reaction.type = ReactionType.like;
    reaction.author = userId;
    reaction.answer = answerId;

    post.likes += 1;
    answer.likes += 1;

    await manager.save(post);
    await manager.save(answer);
    await manager.save(reaction);

    return true;
  });
};
