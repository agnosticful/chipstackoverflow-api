import "dotenv/config";
import Bugsnag from "@bugsnag/js";

Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY!,
  releaseStage: process.env.BUGSNAG_RELEASE_STAGE!,
});

import Fastify from "fastify";
import * as path from "path";
import { createConnection, getConnectionOptions } from "typeorm";
import admin from "./admin";
import apollo from "./graphql";

const fastify = Fastify();

fastify.register(admin);
fastify.register(apollo.createHandler());

(async () => {
  await createConnection({
    ...(await getConnectionOptions()),
    entities: [path.resolve(__dirname, "./entities/**/*.[tj]s")],
    migrations: [path.resolve(__dirname, "./migrations/**/*.[tj]s")],
    subscribers: [path.resolve(__dirname, "./subscribers/**/*.[tj]s")],
  });

  try {
    const address = await fastify.listen({ port: parseInt(process.env.PORT!) });

    console.log(`🚀 Server is ready at ${address}`);
  } catch (err) {
    fastify.log.error(err);

    process.exit(1);
  }
})();
