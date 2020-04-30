import { AuthenticationError } from "apollo-server-fastify";
import User from "../../../entities/User";

export default async (_: any, __: any, context: any) => {
  if (!context.userId) {
    throw new AuthenticationError("Authentication is required.");
  }

  return await User.findOne(context.userId);
};
