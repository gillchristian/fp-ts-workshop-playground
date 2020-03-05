import * as t from 'io-ts'

import {print} from './utils'

// Examples:

const Num = t.number

const result = Num.decode('123')

print(result)

print(t.boolean.decode(true))

print(t.array(t.number).decode([321, 123]))

// what would be the result of these two?
//
// print(t.number.decode(123))
// print(t.number.decode('123'))

// Exercises ///////////////////////////////////////////////////////////////////

// We'll implement the codecs (decoder/encoder) for different API responses
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

const AB = t.keyof({a: null, b: null})
type AB = t.TypeOf<typeof AB> // 'a' | 'b'

const WithName = t.interface({
  name: t.string,
})
type WithName = t.TypeOf<typeof WithName> // type Name = { name: string }

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

export type PaymentMethod =
  | {type: 'credit_card'; owner: string; number: string; expiry: Expiry}
  | {type: 'iban'; owner: string; iban: string}
  | {type: 'bank'; account: string}
  | {type: 'paypal'; email: string}
