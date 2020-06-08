import { AuthenticationError, UserInputError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import Answer, { AnswerBody } from "../../../entities/Answer";
import Post, { PostId } from "../../../entities/Post";
import { Context } from "../../context";

export default async (
  _: any,
  { postId, body }: { postId: PostId; body: string },
  { userId }: Context
) => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  await validatePostId(postId);
  validateBody(body);

  return await getConnection()
    .getRepository(Answer)
    .create({ body, post: postId, author: userId })
    .save();
};

async function validatePostId(postId: PostId) {
  if (!(await Post.findOne(postId))) {
    throw new UserInputError(
      `postId is invalid. The post (id: ${postId}) is not found.`
    );
  }
}

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
