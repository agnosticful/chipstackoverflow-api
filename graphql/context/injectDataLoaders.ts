import DataLoader from "dataloader";
import { FastifyRequest } from "fastify";
import { getConnection } from "typeorm";
import Answer, { AnswerId } from "../../entities/Answer";
import AnswerReaction from "../../entities/AnswerReaction";
import Comment, { CommentId } from "../../entities/Comment";
import CommentReaction from "../../entities/CommentReaction";
import Post, { PostId } from "../../entities/Post";
import User from "../../entities/User";

export interface DataLoaders {
  getAnswersByPostIds: DataLoader<PostId, Answer[]>;
  getAnswerReactionsByAnswerId: DataLoader<AnswerId, AnswerReaction>;
  getAuthorByAnswerId: DataLoader<AnswerId, User>;
  getAuthorByCommentId: DataLoader<CommentId, User>;
  getAuthorByPostId: DataLoader<PostId, User>;
  getCommentsByAnswerId: DataLoader<AnswerId, Comment[]>;
  getCommentReactionsByCommentId: DataLoader<CommentId, CommentReaction>;
  getParentAnswerByCommentId: DataLoader<CommentId, Answer>;
  getParentPostByAnswerId: DataLoader<AnswerId, Post>;
}

export default async (_: FastifyRequest, context: any): Promise<any> => {
  const dataLoaders: DataLoaders = {
    getAnswersByPostIds: new DataLoader((postIds) =>
      Promise.all(
        postIds.map((post) =>
          getConnection()
            .getRepository(Answer)
            .find({ where: { post }, order: { createdAt: "DESC" } })
        )
      )
    ),
    getAnswerReactionsByAnswerId: context.userId
      ? new DataLoader(async (answerIds) => {
          const reactions = await getConnection()
            .getRepository(AnswerReaction)
            .find({
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
    getAuthorByAnswerId: new DataLoader(async (answerIds) => {
      const answers = await getConnection()
        .getRepository(Answer)
        .findByIds(answerIds as any, {
          relations: ["author"],
        });

      return answers.map((answer) => answer.author as User);
    }),
    getAuthorByCommentId: new DataLoader(async (commentIds) => {
      const comments = await getConnection()
        .getRepository(Comment)
        .findByIds(commentIds as any, {
          relations: ["author"],
        });

      return comments.map((comment) => comment.author as User);
    }),
    getAuthorByPostId: new DataLoader(async (postIds) => {
      const posts = await getConnection()
        .getRepository(Post)
        .findByIds(postIds as any, {
          relations: ["author"],
        });

      return posts.map((post) => post.author as User);
    }),
    getCommentsByAnswerId: new DataLoader((answerIds) =>
      Promise.all(
        answerIds.map((answer) =>
          getConnection()
            .getRepository(Comment)
            .find({ where: { answer }, order: { createdAt: "DESC" } })
        )
      )
    ),
    getCommentReactionsByCommentId: context.userId
      ? new DataLoader(async (commentIds) => {
          const reactions = await getConnection()
            .getRepository(CommentReaction)
            .find({
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
    getParentAnswerByCommentId: new DataLoader(async (commentIds) => {
      const comments = await getConnection()
        .getRepository(Comment)
        .findByIds(commentIds as any, {
          relations: ["answer"],
        });

      return comments.map((comment) => comment.answer as Answer);
    }),
    getParentPostByAnswerId: new DataLoader(async (answerIds) => {
      const answers = await getConnection()
        .getRepository(Answer)
        .findByIds(answerIds as any, {
          relations: ["post"],
        });

      return answers.map((answer) => answer.post as Post);
    }),
  };

  return { ...context, dataLoaders };
};

const noopDataLoader = new DataLoader<any, any>((ids) =>
  Promise.resolve(ids.map(() => null))
);
