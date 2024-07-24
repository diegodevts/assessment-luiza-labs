import { unlink } from 'fs/promises'
import { EmptyFileError } from '../errors/empty-file-error'
import { GenericRepository } from '../repositories/generic-repository'
import { UserWithOrdersOutput } from '../types'
import { GenericUseCase } from './generic.usecase'

export class LoadOrdersUseCase implements GenericUseCase<void> {
  constructor(private repository: GenericRepository<UserWithOrdersOutput>) {}

  async handle(filePath: string): Promise<void> {
    if (!filePath) {
      throw new EmptyFileError()
    }

    await this.repository.load(filePath)

    await unlink(filePath)
  }
}
