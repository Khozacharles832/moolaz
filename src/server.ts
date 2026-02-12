import Fastify from "fastify";
import { setupRoutes } from "./api/routes";

const app = Fastify({ logger: true });

setupRoutes(app);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});