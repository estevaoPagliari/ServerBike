import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function bikeRoutes(app: FastifyInstance) {
  app.get('/bikes', async (request) => {
    const bike = await prisma.bikeUser.findMany({
      include: {
        status: true,
      },
    })
    return bike
  })
  app.get('/bikes/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)

    const bike = await prisma.bikeUser.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        status: true,
      },
    })
    return bike
  })
  app.get('/bikesstatus/:userId', async (request) => {
    const paramsSchema = z.object({
      userId: z.string(),
    })
    const { userId } = paramsSchema.parse(request.params)
    console.log(userId)
    const bike = await prisma.bikeUser.findMany({
      where: {
        userId,
      },
      include: {
        status: true,
      },
    })
    return bike
  })
  app.post('/bikes', async (request) => {
    await request.jwtVerify()
    const bodySchema = z.object({
      name: z.string(),
    })
    const { name } = bodySchema.parse(request.body)
    console.log(name)

    const bike = await prisma.bikeUser.create({
      data: {
        name,
        userId: null,
        status: {
          create: {
            velocity: 0,
            averageVelocity: 0,
            odometer: 0,
            totalOdometer: 0,
            error: 0,
            battery: 0,
          },
        },
      },
    })
    return bike
  })
  app.put('/bikes/user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      userId: z.string(),
    })
    const { userId } = bodySchema.parse(request.body)
    const bike = await prisma.bikeUser.update({
      where: {
        id,
      },
      data: {
        userId,
      },
    })
    console.log(id)
    return bike
  })
  app.delete('/bikes/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)
    console.log(id)
    const bike = await prisma.$transaction([
      prisma.status.deleteMany({
        where: {
          bikeId: id,
        },
      }),
      prisma.bikeUser.delete({
        where: {
          id,
        },
      }),
    ])

    if (bike) {
      reply.code(200).send({ message: 'Bike Deletado' })
    } else {
      reply.code(500).send({ message: 'Error' })
    }
  })
}
