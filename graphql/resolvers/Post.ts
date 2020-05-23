import Post from "../../entities/Post";
import { Context } from "../context";

export default {
  answers: async (source: Post, _: any, { dataLoaders }: Context) =>
    dataLoaders.getAnswersByPostIds.load(source.id),
  author: async (source: Post, _: any, { dataLoaders }: Context) =>
    dataLoaders.getAuthorByPostId.load(source.id),
};
