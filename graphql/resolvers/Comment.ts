import Comment from "../../entities/Comment";
import { Context } from "../context";
import ReactionType from "../../entities/ReactionType";

export default {
  liked: async (source: Comment, _: any, { dataLoaders }: Context) => {
    const reaction = await dataLoaders.getCommentReactionsByCommentId.load(
      source.id
    );

    return reaction?.type === ReactionType.like ?? false;
  },
  disliked: async (source: Comment, _: any, { dataLoaders }: Context) => {
    const reaction = await dataLoaders.getCommentReactionsByCommentId.load(
      source.id
    );

    return reaction?.type === ReactionType.dislike ?? false;
  },
  author: async (source: Comment, _: any, { dataLoaders }: Context) =>
    dataLoaders.getAuthorByCommentId.load(source.id),
  answer: async (source: Comment, _: any, { dataLoaders }: Context) =>
    dataLoaders.getParentAnswerByCommentId.load(source.id),
};
