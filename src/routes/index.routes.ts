import { Router } from 'express'
import { Request, Response } from 'express'
import { FileUploader } from '../middlewares/file-uploader'
import { orderController } from '../controllers'

const routes = Router()
const { uploader } = new FileUploader()

routes.post(
  '/load',
  uploader.single('file'),
  async (request: Request, response: Response) => {
    return await orderController.load(request, response)
  }
)

routes.get('/', async (request: Request, response: Response) => {
  return await orderController.findAll(request, response)
})

export { routes }
