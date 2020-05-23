import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Answer from "../../../entities/Answer";
import AnswerReaction from "../../../entities/AnswerReaction";
import Post from "../../../entities/Post";
import ReactionType from "../../../entities/ReactionType";

export default async (_: any, args: any, context: any) => {
  if (!context.userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  return getConnection().transaction(async (manager) => {
    const answer = await manager.findOne(Answer, args.id, {
      relations: ["post"],
    });

    if (!answer) {
      throw new UserInputError(`The answer (id: ${args.id}) does not exist.`);
    }

    const post = answer.post as Post;

    const previousReaction = await manager.findOne(AnswerReaction, {
      where: { author: context.userId, answer: args.id },
    });

    if (previousReaction) {
      if (previousReaction.type === ReactionType.dislike) {
        throw new UserInputError(
          `The answer (id: ${args.id}) has already been disliked.`
        );
      }

      post.likes -= 1;
      answer.likes -= 1;

      await manager.remove(previousReaction);
    }

    const reaction = new AnswerReaction();
    reaction.type = ReactionType.dislike;
    reaction.author = context.userId;
    reaction.answer = args.id;

    post.dislikes += 1;
    answer.dislikes += 1;

    await manager.save(answer.post);
    await manager.save(answer);
    await manager.save(reaction);

    return true;
  });
};
