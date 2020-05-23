import { UserInputError } from "apollo-server-fastify";
import Answer, { AnswerId } from "../../../entities/Answer";
import Comment, { CommentBody } from "../../../entities/Comment";
import requireAuthenticated from "../common/requireAuthenticated";

export default async (_: any, { answerId, body }: any, context: any) => {
  requireAuthenticated(context);

  await validateAnswerId(answerId);
  validateBody(body);

  const comment = new Comment();
  comment.body = body;
  comment.answer = answerId;
  comment.author = context.userId;

  await comment.save();

  return comment;
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
