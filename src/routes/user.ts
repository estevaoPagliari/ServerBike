import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
export async function userRoutes(app: FastifyInstance) {
  /*
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })
  */
  // Get User
  app.get('/user', async (request, reply) => {
    // await request.jwtVerify()
    const user = await prisma.user.findMany({
      include: {
        bike: true,
      },
    })

    return reply.status(200).send({ message: 'Ok', data: user })
  })
  // Get id user
  app.get('/user/:id', async (request) => {
    // await request.jwtVerify()
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        bike: true,
      },
    })
    return user
  })
  // Post User

  async function createUser(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return !!user // Retorna true se o email estiver em uso, caso contrário, retorna false
  }
  app.post('/user', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = bodySchema.parse(request.body)
    try {
      const emailInUse = await createUser(email)
      if (emailInUse) {
        console.log('Email Ja Existe')
        return null
      }
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      })
      return user
    } catch (error) {
      console.log('Erro ao criar usuário:', error)
    }
  })
  // Put User
  app.put('/user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })
    const { name, email } = bodySchema.parse(request.body)

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
    })
    return user
  })
  // Patch Somente do nome
  app.patch('/user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
    })
    const { name } = bodySchema.parse(request.body)

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })
    return user
  })
  // Delete User
  app.delete('/user/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.user.delete({
      where: {
        id,
      },
    })
    if (user) {
      reply.code(200).send({ message: 'User Deletado' })
    } else {
      reply.code(500).send({ message: 'Error' })
    }
  })
}
