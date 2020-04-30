import Post from "../../../entities/Post";

export default async (_: any, __: any, ___: any) => {
  const posts = await Post.find({
    order: { createdAt: "DESC" },
    loadRelationIds: { relations: ["answers", "author"] },
  });

  return posts;
};
