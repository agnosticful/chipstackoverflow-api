import { getConnection } from "typeorm";
import Post, { PostId } from "../../../entities/Post";

export default async (_: any, { id }: { id: PostId }, __: any) =>
  (await getConnection().getRepository(Post).findOne(id)) ?? null;
