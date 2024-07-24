import { Filters, UserWithOrdersOutput } from '../types'
import { GenericRepository } from './generic-repository'
import { createWriteStream, createReadStream } from 'fs'
import { readFile } from 'fs/promises'
import { pipeline } from 'stream/promises'
import { TransformUtil } from '../utils/transform.util'

export class OrdersRepository
  implements GenericRepository<UserWithOrdersOutput>
{
  private transform: TransformUtil
  constructor() {}

  async load(filePath: string): Promise<void> {
    /* Explicação do porquê eu não fiz DIP:
      Por ser uma classe que possui um alto uso de memória, a utilização de apenas uma instância,
      transformará essa classe num monstro gigante consumidor de memória. 
      Ao invés disso, eu crio uma instância pra cada chamada pra API, pra evitar memory leaks. */

    this.transform = new TransformUtil()

    pipeline(
      createReadStream(filePath),
      this.transform,
      createWriteStream('src/uploads/orders.json', {
        flags: 'a',
        encoding: 'utf-8'
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
    const ordersString = await readFile('src/uploads/orders.json', {
      encoding: 'utf-8'
    })

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
