import Post from "../../../entities/Post";

export default async (_: any, args: any, __: any) => {
  const post = await Post.findOne(args.id, {
    loadRelationIds: { relations: ["answers", "author"] },
  });

  console.log(post);

  return post ?? null;
};
