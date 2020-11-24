import * as t from 'io-ts'

import {print, Equals} from '../src/utils'

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

export const AB = t.keyof({a: null, b: null})
export type AB = t.TypeOf<typeof AB> // 'a' | 'b'

const WithName = t.interface({
  name: t.string,
})
type WithName = t.TypeOf<typeof WithName> // type Name = { name: string }

interface WithName_Expected {
  name: string
}

export type Test_WithName = Equals<WithName_Expected, WithName>

// Exercises
//
// Implement the provided interfaces and types as io-ts codes (decoder/encoder)
// The Equals type helper is provided as a way to test that types match
//
// Just like the Test_WithName, if the types do match the copiler accepts it
// otherwise it will show a type error
//
// Running the file with ts-node should produce no type errors :)
//
// $ yarn ts-node src/04.io-ts

// 1. Implement the User (to match User_Expected) interface as an io-ts codec
const User = t.interface({
  id: t.number,
  name: t.string,
  lastName: t.string,
  age: t.number,
  admin: t.boolean,
})
type User = t.TypeOf<typeof User>

interface User_Expected {
  id: number
  name: string
  lastName: string
  age: number
  admin: boolean
}

export type Test_User = Equals<User_Expected, User>

// 2. Implement the Lot (to match Lot_Expected) interface as an io-ts codec
const Auction = t.interface({
  id: t.union([t.string, t.number]),
  title: t.string,
  experts: t.array(User),
})

const Lot = t.intersection([
  t.interface({
    id: t.union([t.string, t.number]),
    title: t.string,
    category: t.number,
    auction: Auction,
  }),
  t.partial({thumbnail: t.string}),
])
type Lot = t.TypeOf<typeof Lot>

interface Auction {
  id: string | number
  title: string
  experts: User[]
}

interface Lot_Expected {
  id: string | number
  title: string
  category: number
  auction: Auction
  thumbnail?: string
}

export type Test_Lot = Equals<Lot_Expected, Lot>

// 3. Implement the Feedback (to match Feedback_Expected) interface as an io-ts codec
const Feedback = t.intersection([
  t.interface({
    orderReference: t.union([t.string, t.number]),
    seller: User,
    buyer: User,
    type: t.keyof({positive: null, neutral: null, negative: null}),
  }),
  t.partial({
    body: t.string,
    ressponse: t.interface({body: t.string}),
  }),
])
type Feedback = t.TypeOf<typeof Feedback>

interface Feedback_Expected {
  orderReference: string | number
  seller: User
  buyer: User
  body?: string
  type: 'positive' | 'neutral' | 'negative'
  ressponse?: {
    body: string
  }
}

export type Test_Feedback = Equals<Feedback_Expected, Feedback>

// 4. Implement the PaymentMethod type (to match PaymentMethod_Expected) as an io-ts codec
const PaymentMethod = t.union([
  t.interface({
    type: t.literal('credit_card'),
    owner: t.string,
    number: t.string,
    expiry: t.interface({month: t.number, year: t.number}),
  }),
  t.interface({
    type: t.literal('iban'),
    owner: t.string,
    iban: t.string,
  }),
  t.interface({
    type: t.literal('bank'),
    account: t.string,
  }),
  t.interface({
    type: t.literal('paypal'),
    email: t.string,
  }),
])
type PaymentMethod = t.TypeOf<typeof PaymentMethod>

export interface Expiry {
  month: number // should be 0 | ... | 11 but for brevity we use number
  year: number // should be positive number but for brevity we use number
}

export type PaymentMethod_Expected =
  | {type: 'credit_card'; owner: string; number: string; expiry: Expiry}
  | {type: 'iban'; owner: string; iban: string}
  | {type: 'bank'; account: string}
  | {type: 'paypal'; email: string}

export type Test_PaymentMethod = Equals<PaymentMethod_Expected, PaymentMethod>
