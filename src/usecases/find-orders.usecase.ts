import { DateError } from '../errors/date.error'
import { EmptyFileError } from '../errors/empty-file-error'
import { GenericRepository } from '../repositories/generic-repository'
import { Filters, UserWithOrdersOutput } from '../types'
import { GenericUseCase } from './generic.usecase'

export class FindOrdersUseCase
  implements GenericUseCase<UserWithOrdersOutput[]>
{
  constructor(private repository: GenericRepository<UserWithOrdersOutput>) {}

  verifyDates(startDate: string, finishDate: string) {
    const startDateToMilliseconds = new Date(startDate).getTime()
    const finishDateToMilliseconds = new Date(finishDate).getTime()

    if (startDateToMilliseconds > finishDateToMilliseconds) {
      throw new DateError('Start date cant be after the end date')
    }

    return {
      startDateToMilliseconds: startDateToMilliseconds.toString(),
      finishDateToMilliseconds: finishDateToMilliseconds.toString()
    }
  }

  async handle({
    skip,
    take,
    startDate,
    finishDate,
    order_id
  }: Filters): Promise<UserWithOrdersOutput[]> {
    const { startDateToMilliseconds, finishDateToMilliseconds } =
      this.verifyDates(startDate, finishDate)

    const orders = await this.repository.findAll({
      skip: skip ?? '0',
      take: take ?? '10',
      startDate: startDateToMilliseconds,
      finishDate: finishDateToMilliseconds,
      order_id
    })

    return orders
  }
}
