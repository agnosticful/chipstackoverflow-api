import { AuthenticationError } from "apollo-server-fastify";
import { getConnection } from "typeorm";
import User from "../../../entities/User";
import { Context } from "../../context";

export default async (_: any, __: any, { userId }: Context) => {
  if (!userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  return await getConnection().getRepository(User).findOne(userId);
};
