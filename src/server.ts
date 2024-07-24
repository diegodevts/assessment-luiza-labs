import express, { Response, Request, NextFunction } from 'express'
import 'dotenv/config'
import { env } from './env'
import compression from 'compression'
import { routes } from './routes'
import cors from 'cors'

const app = express()

const PORT = env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(cors())

app.get('/', (req, res) => {
  return res.send({ message: 'Welcome to API v1.0' })
})

app.use((request: Request, response: Response, next: NextFunction) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', '*')
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')

  app.use(cors())

  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`)
})
