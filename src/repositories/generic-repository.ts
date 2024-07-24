import { Filters } from '../types'

export interface GenericRepository<T> {
  load(filePath: string): Promise<void>
  findAll(data: Filters): Promise<T[]>
}
