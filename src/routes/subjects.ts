import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prismaClient";
import { z } from "zod";

export async function subjectRoutes(app: FastifyInstance) {

  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/subjects', async (request) => {
    const subjects = await prisma.subject.findMany({
      where: {
        userId: request.user.sub
      },

      orderBy: {
        createdAt: "asc"
      }
    })

    return subjects.map((subject) => {
      return {
        id: subject.id,
        name: subject.name,
        excerpt: subject.description,
        createdAt: subject.createdAt
      }
    })
  })

  app.post('/subjects', async (request) => {

    const subjectBody = z.object({
      name: z.string(),
      description: z.string()
    })

    const { name, description } = subjectBody.parse(request.body)

    const subject = await prisma.subject.create({
      data: {
        name,
        description,
        userId: request.user.sub
      }
    })

    return subject
  })

  app.get('/subjects/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const subject = await prisma.subject.findUniqueOrThrow({
      where: {
        id
      },

      include: {
        topics: true
      }
    })

    if (subject.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return subject
  })
}