import Post from "../../../entities/Post";

export default async (_: any, __: any, ___: any) => {
  const posts = await Post.find({
    order: { likes: "DESC" },
    loadRelationIds: { relations: ["answers", "author"] },
  });

  return posts;
};
