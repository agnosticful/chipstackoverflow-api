import { FastifyInstance } from "fastify";
import dashboard from "./dashboard";

export default async (fastify: FastifyInstance, _: any) => {
  fastify.get("/", dashboard);
};
