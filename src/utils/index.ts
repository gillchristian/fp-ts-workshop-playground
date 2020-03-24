import * as t from 'io-ts'
import * as chalk from 'chalk'
import {flow} from 'fp-ts/lib/function'
import {getShow} from 'fp-ts/lib/Either'
import * as IOE from 'fp-ts/lib/IOEither'
import * as IO from 'fp-ts/lib/IO'
import * as IOConsole from 'fp-ts/lib/Console'
import {pipe} from 'fp-ts/lib/pipeable'

// showResult.show: stringifies the result of decoding
const showResult = getShow(
  {
    show: (e: t.Errors) => `${e.length} error${e.length === 1 ? '' : 's'}`,
  },
  {
    // swap these lines to print the result in pretty or not JSON encoding
    // show: (v: any) => JSON.stringify(v),
    show: (v: any) => JSON.stringify(v, null, 2),
  },
)

// print: stringifies a decoding result and prints to the terminal
export const print = flow(showResult.show, console.log)

// Testing

export type Equals<A, _B extends A> = 'passes'

const FAIL = chalk.inverse.bold.red(' FAIL ')
const PASS = chalk.inverse.bold.green(' PASS ')
const SKIP = chalk.inverse.bold.yellow(' PASS ')

const onError = (error: unknown) =>
  error instanceof Error ? error : new Error('Failed')

const formatFail = (desc: string, error: Error) =>
  FAIL + ' ' + chalk.bold.red(desc) + '\n\n' + error.message + '\n'
const formatPass = (desc: string) => PASS + ' ' + chalk.white(desc) + '\n'

export const test = (desc: string, cb: () => void) => {
  const runTest = pipe(
    IOE.tryCatch(cb, onError),
    IOE.fold(
      error => IO.of(formatFail(desc, error)),
      () => IO.of(formatPass(desc)),
    ),
    IO.chain(IOConsole.log),
  )

  runTest()
}

export const xtest = (description: string, _cb: () => void) => {
  const runSkip = IOConsole.log(SKIP + ' ' + chalk.white(description + '\n'))

  runSkip()
}
