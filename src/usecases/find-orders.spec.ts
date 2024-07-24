import { InMemoryOrdersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { unlink } from 'fs/promises'
import { writeFile, readdir } from 'fs/promises'
import { FindOrdersUseCase } from './find-orders.usecase'

let ordersRepository: InMemoryOrdersRepository
let sut: FindOrdersUseCase
let uploadsPath: string = 'src\\repositories\\in-memory\\uploads'
let textPath: string

beforeAll(async () => {
  ordersRepository = new InMemoryOrdersRepository()
  sut = new FindOrdersUseCase(ordersRepository)
  const textToFile =
    '0000000077                         Mrs. Stephen Trantow00000008480000000004        40.720210325\n0000000077                         Mrs. Stephen Trantow00000008410000000006      176.0720210708\n0000000077                         Mrs. Stephen Trantow00000008310000000004      660.7120210524\n0000000077                         Mrs. Stephen Trantow00000008430000000003      769.9320211013\n0000000073                             Saundra Parisian00000007720000000006      956.6820211120\n0000000073                             Saundra Parisian00000007890000000006       65.5320210402\n0000000073                             Saundra Parisian00000007750000000003      555.6620210409\n0000000073                             Saundra Parisian00000007750000000003      555.6620210409\n0000000073                             Saundra Parisian00000007880000000007     1732.0820211125'

  textPath = uploadsPath + '\\orders_test.txt'

  await writeFile(textPath, textToFile)

  await ordersRepository.load(textPath)
})

afterAll(async () => {
  await unlink(uploadsPath + '\\orders_test.json')
})

describe('Find Users with Orders', async () => {
  it('should find users with orders without filters', async () => {
    const filters = {
      skip: undefined,
      take: undefined,
      startDate: undefined,
      finishDate: undefined,
      order_id: undefined
    }

    const users = await sut.handle(filters)

    expect(users.length).toBeGreaterThan(0)
  })

  it('should find users with orders with some filters', async () => {
    const filters = {
      skip: '0',
      take: '1',
      startDate: '2021-03-11',
      finishDate: '2021-03-29',
      order_id: undefined
    }

    const users = await sut.handle(filters)

    expect(users.length).toEqual(+filters.take)
  })
})
