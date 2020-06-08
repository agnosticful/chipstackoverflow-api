import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Answer, { AnswerId } from "../../../entities/Answer";
import Comment, { CommentBody } from "../../../entities/Comment";
import { Context } from "../../context";

export default async (_: any, { answerId, body }: any, { userId }: Context) => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  await validateAnswerId(answerId);
  validateBody(body);

  return await getConnection()
    .getRepository(Comment)
    .create({
      body,
      answer: answerId,
      author: userId,
    })
    .save();
};

async function validateAnswerId(answerId: AnswerId) {
  if (!(await Answer.findOne(answerId))) {
    throw new UserInputError(
      `answerId is invalid. The answer (id: ${answerId}) is not found.`
    );
  }
}

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
