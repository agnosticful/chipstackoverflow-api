import { UserInputError } from "apollo-server-fastify";
import Answer, { AnswerBody } from "../../../entities/Answer";
import Post, { PostId } from "../../../entities/Post";
import requireAuthenticated from "../common/requireAuthenticated";

export default async (
  _: any,
  { postId, body }: { postId: PostId; body: string },
  context: any
) => {
  requireAuthenticated(context);

  await validatePostId(postId);
  validateBody(body);

  const answer = new Answer();
  answer.body = body;
  answer.post = postId;
  answer.author = context.userId;

  await answer.save();

  return answer;
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
