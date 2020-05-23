import Post from "../../../entities/Post";

export default async (_: any, __: any, ___: any) => {
  const posts = await Post.find({ order: { likes: "DESC" } });

  return posts;
};
