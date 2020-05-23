import { AuthenticationError } from "apollo-server-fastify";

export default (context: any) => {
  if (!context.userId) {
    throw new AuthenticationError("Authentication is required.");
  }
};
