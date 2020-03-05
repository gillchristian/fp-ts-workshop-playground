import * as t from 'io-ts'

import {print, Equals} from './utils'

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

interface WithNameExpected {
  name: string;
}

type Test_WithName = Equals<WithNameExpected, WithName>

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

// 1. Implement the User (to match UserExpected) interface as an io-ts codec
const User = t.interface({})
type User = t.TypeOf<typeof User>

interface UserExpected {
  id: number
  name: string
  lastName: string
  age: number
  admin: boolean
}

type Test_User = Equals<UserExpected, User> 

// 2. Implement the Lot (to match LotExpected) interface as an io-ts codec

const Lot = t.interface({})
type Lot = t.TypeOf<typeof Lot>

interface Auction {
  id: string | number
  title: string
  experts: User[]
}

interface LotExpected {
  id: string | number
  title: string
  category: number
  auction: Auction
  thumbnail?: string
}

type Test_Lot = Equals<LotExpected, Lot> 

// 3. Implement the Feedback (to match Expected) interface as an io-ts codec
const Feedback = t.interface({})
type Feedback = t.TypeOf<typeof Feedback>

interface FeedbackExpected {
  orderReference: string | number
  seller: User
  buyer: User
  body?: string
  type: 'positive' | 'neutral' | 'negative'
  ressponse?: {
    body: string
  }
}

type Test_Feedback = Equals<FeedbackExpected, Feedback> 

// 4. Implement the PaymentMethod type (to match PaymentMethodExpected) as an io-ts codec
const PaymentMethod = t.interface({})
type PaymentMethod = t.TypeOf<typeof PaymentMethod>

export interface Expiry {
  month: number // should be 0 | ... | 11 but for brevity we use number
  year: number // should be positive number but for brevity we use number
}

export type PaymentMethodExpected =
  | {type: 'credit_card'; owner: string; number: string; expiry: Expiry}
  | {type: 'iban'; owner: string; iban: string}
  | {type: 'bank'; account: string}
  | {type: 'paypal'; email: string}

type Test_PaymentMethod = Equals<PaymentMethodExpected, PaymentMethod> 
