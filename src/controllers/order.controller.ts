import { Request, Response } from 'express'
import { LoadOrdersUseCase } from '../usecases/load-orders.usecase'
import { EmptyFileError } from '../errors/empty-file-error'
import { z } from 'zod'
import { FindOrdersUseCase } from '../usecases/find-orders.usecase'
import { DateError } from '../errors/date.error'

export class OrdersController {
  constructor(
    private loadOrdersUseCase: LoadOrdersUseCase,
    private findAllOrdersUseCase: FindOrdersUseCase
  ) {}

  async load(request: Request, response: Response) {
    try {
      const file = request.file?.path ?? ''

      await this.loadOrdersUseCase.handle(file)

      return response.status(201).send({
        message: 'The file was uploaded successfully.',
        statusCode: 201
      })
    } catch (error) {
      if (error instanceof EmptyFileError) {
        return response.status(412).send({ message: error.message })
      }

      return response
        .status(500)
        .send({ message: error.message ?? 'Internal Server Error' })
    }
  }

  async findAll(request: Request, response: Response) {
    try {
      const registerQuerySchema = z.object({
        skip: z.optional(z.string()),
        take: z.optional(z.string()),
        order_id: z.optional(z.string()),
        startDate: z.optional(z.string()),
        finishDate: z.optional(z.string())
      })

      const { skip, take, order_id, startDate, finishDate } =
        registerQuerySchema.parse(request.query)

      const orders = await this.findAllOrdersUseCase.handle({
        skip,
        take,
        startDate,
        finishDate,
        order_id
      })

      return response.send({ message: 'Ok.', orders, statusCode: 200 })
    } catch (error) {
      if (error instanceof DateError) {
        return response.status(412).send({ message: error.message })
      }

      return response
        .status(500)
        .send({ message: error.message ?? 'Internal Server Error' })
    }
  }
}
