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
const print = flow(showResult.show, console.log)

// Examples:

print(t.number.decode(123))
print(t.number.decode('123'))

print(t.string.decode('123'))

print(t.boolean.decode(true))

print(t.array(t.boolean).decode([true, false]))

// Exercises ///////////////////////////////////////////////////////////////////

// We'll implement the codecs (decoder/encoder) for different API ressponses
// Using the following built in codecs should be enough

t.string
t.number
t.boolean
t.null
t.undefined
t.array
t.union
t.keyof
t.interface

// 1. Implement the User interface as an io-ts codec

interface User {
  id: number
  name: string
  lastName: string
  age: number
  admin: boolean
}

// 2. Implement the Lot interface as an io-ts codec
interface Auction {
  id: string | number
  title: string
  experts: User[]
}

interface Lot {
  id: string | number
  title: string
  category: number
  auction: Auction
  thumbnail?: string
}

// 3. Implement the Feedback interface as an io-ts codec

interface Feedback {
  orderReference: string | number
  seller: User
  buyer: User
  body?: string
  type: 'positive' | 'neutral' | 'negative'
  ressponse?: {
    body: string
  }
}

// 4. Implement the PaymentMethod interface as an io-ts codec
export interface Expiry {
  month: number // should be 0 | ... | 11 but for brevity we use number
  year: number // should be positive number but for brevity we use number
}

type PaymentMethod =
  | {type: 'credit_card'; owner: string; number: string; expiry: Expiry}
  | {type: 'iban'; owner: string; iban: string}
  | {type: 'bank'; account: string}
  | {type: 'paypal'; email: string}
