import { FastifyRequest } from "fastify";
import authenticate from "./authenticate";
import injectDataLoaders, { DataLoaders } from "./injectDataLoaders";

export default async (request: FastifyRequest) => {
  let context = {};

  context = await authenticate(request, context);
  context = await injectDataLoaders(request, context);

  return context;
};

export interface Context {
  userId?: string;
  dataLoaders: DataLoaders;
}
