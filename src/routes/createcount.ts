import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function createcountRoutes(app: FastifyInstance) {
  app.post('/verifyemail', async (request) => {
    const bodySchema = z.object({
      email: z.string(),
    })

    const { email } = bodySchema.parse(request.body)
    const emailuser = prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
      },
    })

    return emailuser // Retorna true se o email estiver em uso, caso contrário, retorna false
  })

  app.post('/createUser', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { email, name, password } = bodySchema.parse(request.body)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    })
    return user
  })
}
