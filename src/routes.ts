import { Router } from 'express'
import { routes } from './routes/index.routes'
const endpoint = Router()

endpoint.use('/orders', routes)

export { endpoint as routes }
