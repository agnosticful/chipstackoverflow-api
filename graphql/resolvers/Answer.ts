import Answer from "../../entities/Answer";
import ReactionType from "../../entities/ReactionType";
import { Context } from "../context";

export default {
  liked: async (source: Answer, _: any, { dataLoaders }: Context) => {
    const reaction = await dataLoaders.getAnswerReactionsByAnswerId.load(
      source.id
    );

    return reaction?.type === ReactionType.like ?? false;
  },
  disliked: async (source: Answer, _: any, { dataLoaders }: Context) => {
    const reaction = await dataLoaders.getAnswerReactionsByAnswerId.load(
      source.id
    );

    return reaction?.type === ReactionType.dislike ?? false;
  },
  comments: (source: Answer, _: any, { dataLoaders }: Context) =>
    dataLoaders.getCommentsByAnswerId.load(source.id),
  author: async (source: Answer, _: any, { dataLoaders }: Context) =>
    dataLoaders.getAuthorByAnswerId.load(source.id),
  post: async (source: Answer, _: any, { dataLoaders }: Context) =>
    dataLoaders.getParentPostByAnswerId.load(source.id),
};
