import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Answer, { AnswerBody } from "../../../entities/Answer";
import Post, { PostId } from "../../../entities/Post";
import { Context } from "../../context";
import User from "../../../entities/User";

export default async (
  _: any,
  { postId, body }: { postId: PostId; body: string },
  { userId }: Context
): Promise<Answer> => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  validateBody(body);

  return await getConnection().transaction(async (manager) => {
    const [user, post] = await Promise.all([
      manager.getRepository(User).findOne(userId, {
        lock: { mode: "pessimistic_read" },
      }),
      manager
        .getRepository(Post)
        .findOne(postId, { lock: { mode: "pessimistic_read" } }),
    ]);

    if (!user) {
      throw new ForbiddenError(
        "Your user data needs to exist to create an answer."
      );
    }

    if (!post) {
      throw new UserInputError(
        `The given postId is invalid. The post (id: ${postId}) is not found.`
      );
    }

    const result = await manager
      .getRepository(Answer)
      .insert({ body, post: post.id, author: user.id });

    const answer = await manager
      .getRepository(Answer)
      .findOne(result.identifiers[0].id);

    if (!answer) {
      throw new Error("No new answer was successfully created.");
    }

    return answer;
  });
};

function validateBody(body: string): asserts body is AnswerBody {
  if (body.trim() !== body) {
    throw new UserInputError(
      `body is invalid. body must not include whitespace characters at the head or tail.`
    );
  }

  if (body.length < 8 || body.length > 65535) {
    throw new UserInputError(
      `body is invalid. body must be 8 to 65535 character length.`
    );
  }
}
