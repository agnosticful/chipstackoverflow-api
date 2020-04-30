import { ApolloServer } from "apollo-server-fastify";
import context from "./context";
import resolvers from "./resolvers";
import schema from "./schema";

export default new ApolloServer({
  typeDefs: schema,
  resolvers,
  context,
  introspection: true,
  playground: true,
  tracing: true,
  engine: {
    apiKey: "service:chipstackoverflow:f6tO9MtFz4OR-jwpEICpeg",
  },
});
