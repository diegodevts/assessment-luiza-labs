import { OrdersRepository } from '../repositories/orders'
import { FindOrdersUseCase } from '../usecases/find-orders.usecase'
import { LoadOrdersUseCase } from '../usecases/load-orders.usecase'
import { OrdersController } from './order.controller'

const repository = new OrdersRepository()
const loadOrders = new LoadOrdersUseCase(repository)
const findAllOrders = new FindOrdersUseCase(repository)

const orderController = new OrdersController(loadOrders, findAllOrders)

export { orderController }
