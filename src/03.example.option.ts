import * as O from 'fp-ts/lib/Option'
import {pipe} from 'fp-ts/lib/pipeable'

// type Option<Data>      =      None | Some<Data>
// type Either<Err, Data> = Left<Err> | Right<Data>

const parse = (str: string) => {
  const n = parseInt(str, 10)

  return Number.isNaN(n) ? O.none : O.some(n)
}

const isEven = (n: number) => (n % 2 === 0 ? O.some(n) : O.none)

const isInRange = (from: number, to: number) => (n: number) =>
  from <= n && n <= to ? O.some(n) : O.none

export const keepEvenInRange = (str: string) =>
  pipe(str, parse, O.chain(isEven), O.chain(isInRange(0, 100)))
