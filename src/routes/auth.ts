import { z } from "zod";
import { prisma } from "../lib/prismaClient";
import { authenticate } from "../plugins/authenticate";
import { FastifyInstance } from "fastify";

import axios from "axios";

export async function authRoutes(app: FastifyInstance){
  app.get('/me', {
    onRequest: [authenticate]
  }, async (request) => {
    return {
      user: request.user
    }
  })

  app.post('/register', async (request) => {
    
    const bodySchema = z.object({
      access_token: z.string()
    })

    const { access_token } = bodySchema.parse(request.body)

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    const userSchema = z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      picture: z.string().url()
    })

    const userInfo = userSchema.parse(userResponse.data)

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id
      }
    })

    if(!user){
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.name,
          avatarUrl: userInfo.picture
        }
      })
    }

    const token = app.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl
    }, {
      sub: user.id,
      expiresIn: '15 days'
    })

    console.log(token)

    return { token }
  })
}