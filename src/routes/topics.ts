import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prismaClient";

export async function topicRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/topics', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const topics = await prisma.topic.findMany({
      where: {
        subjectId: id
      },

      include: {
        matters: true
      }
    })

    return topics.map((topic) => {
      return {
        id: topic.id,
        name: topic.name,
        excerpt: topic.description,
        isCompleted: topic.isCompleted
      }
    })
  })

  app.post('/topics', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isCompleted: z.boolean().default(false)
    })

    const { name, description, isCompleted } = bodySchema.parse(request.body)

    const topic = await prisma.topic.create({
      data: {
        name,
        description,
        isCompleted
      }
    })

    return topic
  })
}