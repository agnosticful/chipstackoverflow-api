import "dotenv/config";
import Fastify from "fastify";
import * as path from "path";
import { createConnection, getConnectionOptions } from "typeorm";
import admin from "./admin";
import apollo from "./graphql";

const fastify = Fastify();

fastify.register(admin);
fastify.register(apollo.createHandler());

fastify.get(
  "/.well-known/acme-challenge/lAyuSE4ow1fkY8LvAf-vJV_RpeBaNegHvijPHWNO5AA",
  (_, reply) => {
    reply.send(
      "lAyuSE4ow1fkY8LvAf-vJV_RpeBaNegHvijPHWNO5AA.LwPsxreP2u3mY76MKChA4fvuowa4GayT2d_aOWCpzKQ"
    );
  }
);

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
