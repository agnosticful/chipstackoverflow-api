import Bugsnag from "@bugsnag/js";
import { FastifyRequest } from "fastify";
import * as admin from "firebase-admin";
import User from "../../entities/User";
import { getConnection } from "typeorm";

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL,
    privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
  }),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export default async (request: FastifyRequest, context: any): Promise<any> => {
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer ")
  ) {
    const token = request.headers.authorization.substring(7);
    let decodedToken: admin.auth.DecodedIdToken;

    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    } catch (err) {
      Bugsnag.notify(err);

      return context;
    }

    const user = await getConnection().transaction(async (manager) => {
      const user = await manager
        .getRepository(User)
        .findOne({ where: { authenticationId: decodedToken.uid } });

      if (user) {
        return user;
      }

      const result = await manager.getRepository(User).insert({
        email: decodedToken.email ?? null,
        name: decodedToken.name ?? "No Name",
        profileImageURL: decodedToken.picture ?? "naiyo",
        authenticationId: decodedToken.uid,
      });

      const createdUser = await manager
        .getRepository(User)
        .findOne(result.identifiers[0].id);

      if (!createdUser) {
        throw new Error(
          "User generation failed. No new user was successfully created."
        );
      }

      return createdUser;
    });

    return { ...context, userId: user.id };
  }

  return context;
};
