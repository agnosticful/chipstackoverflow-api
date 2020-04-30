import Comment from "../../entities/Comment";
import { Context } from "../context";
import ReactionType from "../../entities/ReactionType";

export default {
  liked: async (source: Comment, _: any, { dataLoaders }: Context) => {
    const reaction = await dataLoaders.getCommentReactionsByCommentIds.load(
      source.id as any
    );

    return reaction?.type === ReactionType.like ?? false;
  },
  disliked: async (source: Comment, _: any, { dataLoaders }: Context) => {
    const reaction = await dataLoaders.getCommentReactionsByCommentIds.load(
      source.id as any
    );

    return reaction?.type === ReactionType.dislike ?? false;
  },
  author: async (source: Comment, _: any, { dataLoaders }: Context) =>
    dataLoaders.getUsersByIds.load(source.author as any),
  answer: async (source: Comment, _: any, { dataLoaders }: Context) =>
    dataLoaders.getAnswersByIds.load(source.answer as any),
};
