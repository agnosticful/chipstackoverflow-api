import Post from "../../entities/Post";
import { Context } from "../context";

export default {
  answers: async (source: Post, _: any, { dataLoaders }: Context) =>
    dataLoaders.getAnswersByIds.loadMany(source.answers as any),
  author: async (source: Post, _: any, { dataLoaders }: Context) =>
    dataLoaders.getUsersByIds.load(source.author as any),
};
