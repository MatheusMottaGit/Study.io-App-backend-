import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prismaClient";
import { z } from "zod";

export async function matterRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/matters', async (request) => {

    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const matters = await prisma.matter.findMany({
      where: {
        topicId: id
      }
    })

    return matters.map((matter) => {
      return {
        id: matter.id,
        name: matter.name,
        isDone: matter.isDone
      }
    })
  })

  app.post('/matters', async (request) => {
    const bodySchema = z.object({
      name: z.string()
    })

    const { name } = bodySchema.parse(request.body)

    const matter = await prisma.matter.create({
      data: {
        name
      }
    })

    return matter
  })
}