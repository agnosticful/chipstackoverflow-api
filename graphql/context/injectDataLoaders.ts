import DataLoader from "dataloader";
import { FastifyRequest } from "fastify";
import Answer from "../../entities/Answer";
import AnswerReaction from "../../entities/AnswerReaction";
import Comment from "../../entities/Comment";
import CommentReaction from "../../entities/CommentReaction";
import Post from "../../entities/Post";
import User from "../../entities/User";

export interface DataLoaders {
  getUsersByIds: DataLoader<string, User>;
  getAnswersByIds: DataLoader<string, Answer>;
  getAnswerReactionsByAnswerIds: DataLoader<string, AnswerReaction>;
  getCommentsByIds: DataLoader<string, Comment>;
  getCommentReactionsByCommentIds: DataLoader<string, CommentReaction>;
  getPostsByIds: DataLoader<string, Post>;
}

export default async <Context extends any = any>(
  _: FastifyRequest,
  context: Context
): Promise<Context> => {
  const dataLoaders: DataLoaders = {
    getUsersByIds: new DataLoader((userIds) => User.findByIds(userIds as any)),
    getAnswersByIds: new DataLoader((answerIds) =>
      Answer.findByIds(answerIds as any, {
        loadRelationIds: { relations: ["author", "post", "comments"] },
      })
    ),
    getAnswerReactionsByAnswerIds: context.userId
      ? new DataLoader(async (answerIds) => {
          const reactions = await AnswerReaction.find({
            where: answerIds.map((answerId) => ({
              author: context.userId,
              answer: answerId,
            })),
            loadRelationIds: { relations: ["author", "answer"] },
          });

          return answerIds.map(
            (answerId) =>
              reactions.find(
                (reaction) => (reaction.answer as any) === answerId
              ) ?? null
          );
        })
      : noopDataLoader,
    getCommentsByIds: new DataLoader((commentIds) =>
      Comment.findByIds(commentIds as any, {
        loadRelationIds: { relations: ["author", "answer"] },
      })
    ),
    getCommentReactionsByCommentIds: context.userId
      ? new DataLoader(async (commentIds) => {
          const reactions = await CommentReaction.find({
            where: commentIds.map((commentId) => ({
              author: context.userId,
              answer: commentId,
            })),
            loadRelationIds: { relations: ["author", "comment"] },
          });

          return commentIds.map(
            (commentId) =>
              reactions.find(
                (reaction) => (reaction.comment as any) === commentId
              ) ?? null
          );
        })
      : noopDataLoader,
    getPostsByIds: new DataLoader((postIds) => {
      console.log(postIds);

      Post.findByIds(postIds as any, {
        loadRelationIds: { relations: ["author", "answers"] },
      }).then((res) => {
        console.log(res);
      });

      return Post.findByIds(postIds as any, {
        loadRelationIds: { relations: ["author", "answers"] },
      });
    }),
  };

  return { ...context, dataLoaders };
};

const noopDataLoader = new DataLoader<any, any>((ids) =>
  Promise.resolve(ids.map(() => null))
);
