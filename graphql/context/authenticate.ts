import { FastifyRequest } from "fastify";
import * as admin from "firebase-admin";
import User from "../../entities/User";

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
      return context;
    }

    let user = await User.findOne({
      where: { authenticationId: decodedToken.uid },
    });

    if (!user) {
      user = new User();
      user.email = decodedToken.email ?? null;
      user.name = decodedToken.name ?? "No Name";
      user.profileImageURL = decodedToken.picture ?? "naiyo";
      user.authenticationId = decodedToken.uid;

      await user.save();
    }

    return { ...context, userId: user.id };
  }

  return context;
};
