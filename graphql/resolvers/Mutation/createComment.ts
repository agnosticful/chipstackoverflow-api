import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Answer, { AnswerId } from "../../../entities/Answer";
import Comment, { CommentBody } from "../../../entities/Comment";
import { Context } from "../../context";
import User from "../../../entities/User";

export default async (
  _: any,
  { answerId, body }: { answerId: AnswerId; body: string },
  { user }: Context
): Promise<Comment> => {
  if (!user) {
    throw new AuthenticationError("Authentication is required.");
  }

  validateBody(body);

  return await getConnection().transaction(async (manager) => {
    const [userForCheck, answer] = await Promise.all([
      manager.getRepository(User).findOne(user.id, {
        lock: { mode: "pessimistic_read" },
      }),
      manager
        .getRepository(Answer)
        .findOne(answerId, { lock: { mode: "pessimistic_read" } }),
    ]);

    if (!userForCheck) {
      throw new ForbiddenError(
        "Your user data needs to exist to create an answer."
      );
    }

    if (!answer) {
      throw new UserInputError(
        `The given answerd is invalid. The answer (id: ${answerId}) is not found.`
      );
    }

    const result = await manager
      .getRepository(Comment)
      .insert({ body, answer: answer.id, author: user.id });

    const comment = await manager
      .getRepository(Comment)
      .findOne(result.identifiers[0].id);

    if (!comment) {
      throw new Error("No new comment was successfully created.");
    }

    return comment;
  });
};

function validateBody(body: string): asserts body is CommentBody {
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
