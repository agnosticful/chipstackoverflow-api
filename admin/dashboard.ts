import { FastifyRequest, FastifyReply } from "fastify";
import * as http from "http";

export default (
  _: FastifyRequest,
  reply: FastifyReply<http.ServerResponse>
) => {
  reply.headers({ "content-type": "text/html" });
  reply.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>CSOF Admin</title>
      <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/6.2.0/firebase-auth.js"></script>

      <script>
        window.addEventListener("load", async () => {
          firebase.initializeApp({
            apiKey: "${process.env.FIREBASE_CLIENT_API_KEY}",
            authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
            projectId: "${process.env.FIREBASE_PROJECT_ID}",
          });

          const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

          document.getElementById("sign-in").addEventListener("click", () => {
            firebase.auth().signInWithPopup(googleAuthProvider);
          });

          document.getElementById("sign-out").addEventListener("click", () => {
            firebase.auth().signOut();
          });

          firebase.auth().onAuthStateChanged(async (user) => {
            document.getElementById("login-status-loading").setAttribute("hidden", "");

            if (user) {
              document.getElementById("login-status-signed-out").setAttribute("hidden", "");
              document.getElementById("signed-in-email").textContent = user.email;
              document.getElementById("login-status-signed-in").removeAttribute("hidden");
              document.getElementById("token").value = await user.getIdToken();
            } else {
              document.getElementById("login-status-signed-out").removeAttribute("hidden");
              document.getElementById("login-status-signed-in").setAttribute("hidden", "");
            }
          });
        });
      </script>
    </head>
    <body>
      <h1>Chipstackoverflow Admin</h1>

      <h2>GraphQL</h2>
    
      <p>
        <a href="/graphql">Playground</a>
      </p>
      
      <h2>Authentication</h2>
    
      <p id="login-status-loading">
        Checking...
      </p>

      <div id="login-status-signed-in" hidden>
        <p>
          Signed in as: <span id="signed-in-email"></span>
        </p>

        <p>
          Authentication Token: <input id="token" type="text" placeholder="Loading..." readonly></input>
        </p>

        <p>
          <button id="sign-out">Sign out</button>
        </p>
      </div>

      <p id="login-status-signed-out" hidden>
        <button id="sign-in">Sign in</button>
      </p>
    </body>
    </html>
  `);
};
