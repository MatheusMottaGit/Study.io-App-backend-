import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import fastify from "fastify";

import { authRoutes } from "./routes/auth";
import { topicRoutes } from "./routes/topics";
import { matterRoutes } from "./routes/matters";
import { subjectRoutes } from "./routes/subjects";


const app = fastify()

app.register(cors, {
  origin: true
})

app.register(jwt, {
  secret: 'studyio'
})

app.register(authRoutes)
app.register(subjectRoutes)
app.register(topicRoutes)
app.register(matterRoutes)

app
  .listen({ port: 3333, host: '0.0.0.0' })
  .then(() => console.log('server running...'))