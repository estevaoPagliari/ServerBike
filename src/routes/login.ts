import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function loginRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = bodySchema.parse(request.body)

    const login = prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    })
    console.log('Login')
    if (login && (await login).password === password) {
      const token = app.jwt.sign(
        { name: (await login).name },
        { sub: (await login).id, expiresIn: '10m' },
      )
      // console.log(token)
      return reply
        .status(200)
        .send({ message: 'credenciaisCorretas: true', token })
    } else {
      return reply.status(401).send({ message: 'credenciaisCorretas: false' })
    }
  })
}
