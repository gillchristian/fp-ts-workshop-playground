import * as t from 'io-ts'
import {flow} from 'fp-ts/lib/function'
import {getShow} from 'fp-ts/lib/Either'

// showResult.show: stringifies the result of decoding
const showResult = getShow(
  {
    show: (e: t.Errors) => `${e.length} error${e.length === 1 ? '' : 's'}`,
  },
  {
    // swap thise lines to print the result in pretty or not JSON encoding
    // show: (v: any) => JSON.stringify(v),
    show: (v: any) => JSON.stringify(v, null, 2),
  },
)

// print: stringifies a decoding result and prints to the terminal
export const print = flow(showResult.show, console.log)

export type Equals<A, B extends A> = 'passes'
