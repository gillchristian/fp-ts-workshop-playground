import * as E from 'fp-ts/lib/Either'
import {pipe} from 'fp-ts/lib/pipeable'

// type Option<Data>      =      None | Some<Data>
// type Either<Err, Data> = Left<Err> | Right<Data>

const parseNum = (str: string) => {
  const n = parseInt(str, 10)

  return Number.isNaN(n) ? E.left('not a number') : E.right(n)
}

const isEven = (n: number) => (n % 2 === 0 ? E.right(n) : E.left('odd number'))

const isInRange = (from: number, to: number) => (n: number) =>
  from <= n && n <= to ? E.right(n) : E.left('not in range')

export const keepEvenInRange = (str: string) =>
  pipe(str, parseNum, E.chain(isEven), E.chain(isInRange(0, 100)))
