import { InMemoryOrdersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { writeFile, readdir, unlink } from 'fs/promises'
import { EmptyFileError } from '../errors/empty-file-error'
import { LoadOrdersUseCase } from './load-orders.usecase'

let ordersRepository: InMemoryOrdersRepository
let sut: LoadOrdersUseCase
let uploadsPath: string = 'src\\repositories\\in-memory\\uploads'
let textPath: string

beforeAll(async () => {
  ordersRepository = new InMemoryOrdersRepository()
  sut = new LoadOrdersUseCase(ordersRepository)

  const textToFile =
    '0000000077                         Mrs. Stephen Trantow00000008480000000004        40.720210325\n0000000077                         Mrs. Stephen Trantow00000008410000000006      176.0720210708\n0000000077                         Mrs. Stephen Trantow00000008310000000004      660.7120210524\n0000000077                         Mrs. Stephen Trantow00000008430000000003      769.9320211013\n0000000073                             Saundra Parisian00000007720000000006      956.6820211120\n0000000073                             Saundra Parisian00000007890000000006       65.5320210402\n0000000073                             Saundra Parisian00000007750000000003      555.6620210409\n0000000073                             Saundra Parisian00000007750000000003      555.6620210409\n0000000073                             Saundra Parisian00000007880000000007     1732.0820211125'

  textPath = uploadsPath + '\\orders_test.txt'

  await writeFile(textPath, textToFile)
})

describe('Load Users with Orders', async () => {
  it('should load users with orders', async () => {
    await sut.handle(textPath)

    const hasJsonFile = (await readdir(uploadsPath)).includes(
      'orders_test.json'
    )

    expect(hasJsonFile).toBeTruthy()
  })

  it('should throw an empty file error', async () => {
    const filePath = ''

    await expect(async () => await sut.handle(filePath)).rejects.toBeInstanceOf(
      EmptyFileError
    )
  })
})
