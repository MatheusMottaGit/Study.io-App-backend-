import fastify from "fastify";
import jwt from "@fastify/jwt";

import { authRoutes } from "./routes/auth";

const app = fastify()

app.register(jwt, {
  secret: 'wdj2nefhduxrfwjdk'
})

app.register(authRoutes)

app
  .listen({ port: 3333 })
  .then(() => console.log('server running...'))