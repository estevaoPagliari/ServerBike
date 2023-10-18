import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function statusRoutes(app: FastifyInstance) {
  app.get('/status', async () => {
    const status = await prisma.status.findMany({})
    return status
  })
  app.get('/status/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    const status = await prisma.status.findFirstOrThrow({
      where: {
        id,
      },
    })
    return status
  })
  app.get('/statusbikeid/:bikeId', async (request) => {
    const paramsSchema = z.object({
      bikeId: z.string(),
    })

    const { bikeId } = paramsSchema.parse(request.params)

    const status = await prisma.status.findMany({
      where: {
        bikeId,
      },
    })
    return status
  })
  app.patch('/status/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)
    const bodySchema = z.object({
      velocity: z.number(),
      averageVelocity: z.number().optional(),
      odometer: z.number().optional(),
      totalOdometer: z.number().optional(),
      error: z.number().optional(),
      battery: z.number().optional(),
    })

    const {
      velocity,
      averageVelocity,
      odometer,
      totalOdometer,
      error,
      battery,
    } = bodySchema.parse(request.body)

    const status = await prisma.status.update({
      where: {
        id,
      },
      data: {
        velocity,
        averageVelocity,
        odometer,
        totalOdometer,
        error,
        battery,
      },
    })
    return status
  })
}
