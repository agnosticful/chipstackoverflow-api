import Post from "../../../entities/Post";

export default async (_: any, args: any, __: any) =>
  (await Post.findOne(args.id)) ?? null;
