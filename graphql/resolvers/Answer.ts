import Answer from "../../entities/Answer";
import ReactionType from "../../entities/ReactionType";
import { Context } from "../context";

export default {
  liked: async (source: Answer, _: any, { dataLoaders }: Context) => {
    const reaction = await dataLoaders.getAnswerReactionsByAnswerIds.load(
      source.id as any
    );

    return reaction?.type === ReactionType.like ?? false;
  },
  disliked: async (source: Answer, _: any, { dataLoaders }: Context) => {
    const reaction = await dataLoaders.getAnswerReactionsByAnswerIds.load(
      source.id as any
    );

    return reaction?.type === ReactionType.dislike ?? false;
  },
  comments: (source: Answer, _: any, { dataLoaders }: Context) =>
    dataLoaders.getCommentsByIds.loadMany(source.comments as any),
  author: async (source: Answer, _: any, { dataLoaders }: Context) =>
    dataLoaders.getUsersByIds.load(source.author as any),
  post: async (source: Answer, _: any, { dataLoaders }: Context) => {
    return dataLoaders.getPostsByIds.load(source.post as any);
  },
};
