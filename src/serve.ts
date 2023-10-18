import fastity from 'fastify'
import jwt from '@fastify/jwt'
import { bikeRoutes } from './routes/bike'
import { userRoutes } from './routes/user'
import { statusRoutes } from './routes/status'
import { loginRoutes } from './routes/login'
import { createcountRoutes } from './routes/createcount'

const app = fastity()

app.register(jwt, {
  secret: 'AiBike8266',
})

app.register(userRoutes)
app.register(bikeRoutes)
app.register(statusRoutes)
app.register(loginRoutes)
app.register(createcountRoutes)

app
  .listen({
    port: 3000,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 Server Api rodando')
  })
