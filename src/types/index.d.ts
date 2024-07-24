export type UserWithOrdersOutput = {
  user_id: number
  name: string
  orders: Order[]
}

type Order = {
  order_id: number
  total: number
  date: string | Date
  products: Product[]
}

type Product = {
  product_id: number
  value: number
}

export type Filters = { [...key: string]: string }
