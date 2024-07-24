import { Transform } from 'stream'
import { UserWithOrdersOutput } from '../types'

export class TransformUtil extends Transform {
  private buffer: BufferEncoding | string

  constructor() {
    super()
    this.buffer = ''
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString()
    callback()
  }

  _flush(callback) {
    try {
      const rows = this.buffer.split('\n').toString().split('|')
      const ordersFormatted = rows
        .map((row) => row.replace(/000000/g, ' ').replace(/[ \t]+/g, ' '))
        .toString()
        .split('|')
        .toString()

      const users: UserWithOrdersOutput[] = []
      const ordersToMap = ordersFormatted
        .split(',')
        .filter((data) => data.length >= 6)

      for (let str of ordersToMap) {
        const parts = str.trim().split(' ')
        const name = parts.filter((part) => isNaN(+part)).join(' ')
        const hasUser = users.findIndex((user) => user.name === name)
        const user_id = +parts[0]
        const order_id = +parts[parts.length - 3]
        const product_id = +parts[parts.length - 2]

        const valueAndDate = parts[parts.length - 1]
        const date = valueAndDate.slice(-8)
        const value = +valueAndDate.slice(0, -8)

        const formattedDate = `${date.slice(0, 4)}-${date.slice(
          4,
          6
        )}-${date.slice(6, 8)}`

        if (hasUser === -1) {
          users.push({
            user_id,
            name,
            orders: [
              {
                date: formattedDate,
                total: value,
                order_id,
                products: [
                  {
                    product_id,
                    value
                  }
                ]
              }
            ]
          })
        } else {
          const hasOrder = users[hasUser].orders.findIndex(
            (order) => order.order_id === order_id
          )

          if (hasOrder === -1) {
            users[hasUser].orders.push({
              date: formattedDate,
              order_id,
              total: value,
              products: [
                {
                  product_id,
                  value
                }
              ]
            })
          } else {
            users[hasUser].orders[hasOrder].products.push({
              product_id,
              value
            })

            users[hasUser].orders[hasOrder].total = users[hasUser].orders[
              hasOrder
            ].products.reduce((sum, product) => sum + product.value, 0)
          }
        }
      }

      const resultArray = Object.values(users)

      this.push(JSON.stringify(resultArray, null, 2))

      callback()
    } catch (error) {}
  }
}
