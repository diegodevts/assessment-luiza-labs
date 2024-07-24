import { createWriteStream, createReadStream } from 'fs'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { readFile } from 'fs/promises'
import { TransformUtil } from '../../utils/transform.util'
import { GenericRepository } from '../generic-repository'
import { Filters, UserWithOrdersOutput } from '../../types'

export class InMemoryOrdersRepository
  implements GenericRepository<UserWithOrdersOutput>
{
  private transform: TransformUtil
  constructor() {}

  async load(filePath: string): Promise<void> {
    const pipelineAsync = promisify(pipeline)
    this.transform = new TransformUtil()

    await pipelineAsync(
      createReadStream(filePath),
      this.transform,
      createWriteStream('src/repositories/in-memory/uploads/orders_test.json', {
        flags: 'a'
      })
    )
  }
  async findAll({
    skip,
    take,
    startDate,
    finishDate,
    order_id
  }: Filters): Promise<UserWithOrdersOutput[]> {
    const ordersString = await readFile(
      'src/repositories/in-memory/uploads/orders_test.json',
      {
        encoding: 'utf-8'
      }
    )

    const ordersToArray = JSON.parse(
      ordersString.replace('][', ',')
    ) as UserWithOrdersOutput[]

    const filteredOrders = ordersToArray
      .map((data) => {
        if ((+startDate && +finishDate) || order_id) {
          data.orders = data.orders.filter(
            (order) =>
              (new Date(order.date).getTime() >= +startDate &&
                new Date(order.date).getTime() <= +finishDate) ||
              order.order_id == +order_id
          )
        }

        return data
      })
      .filter((data) => data.orders.length > 0)

    const limitedOrders = filteredOrders.splice(+skip, +take)

    return limitedOrders as UserWithOrdersOutput[]
  }
}
