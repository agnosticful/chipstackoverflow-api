import { getConnection } from "typeorm";
import Post from "../../../entities/Post";

export default async (_: any, __: any, ___: any) =>
  getConnection()
    .getRepository(Post)
    .find({ order: { likes: "DESC" } });
