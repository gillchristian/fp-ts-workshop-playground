import {pipe} from 'fp-ts/lib/pipeable'
import {
  right,
  left,
  map,
  chain,
  fold,
  getOrElse,
  fromNullable,
  fromPredicate,
  tryCatch,
  parseJSON,
  mapLeft,
  Either,
} from 'fp-ts/lib/Either'

import {Expiry} from './04.io-ts'

// Error handling in a functional way.
//
// Either is the box that allows us to build pipelines where we handle errors
// declaratively (short circuit in case of errors)
//
// As we saw in the previous step, io-ts uses Either to provide the result of
// decoding which can either (pun intended) fail with some error or succeed
//
// All the operations (like map & chain) are "right biased" meaing they won't
// change the value if it were to be a left
//
// https://gcanti.github.io/fp-ts/modules/Either.ts.html

interface User {
  name: string
}
const getUserName = ({name}: User) => name
const isUser = (payload: any): payload is User =>
  typeof payload === 'object' &&
  payload !== null &&
  typeof payload.name === 'string'

const error = new Error('Failed to fetch')
const martha = {name: 'Martha'}

// Tools ///////////////////////////////////////////////////////////////////////

// Create Either values

const userA = left(error)
const userB = right(martha)

// map
//
// allows to transform the right value

map(getUserName)(userA) // left(error)
map(getUserName)(userB) // right('martha')

// chain
//
// allows to chain operations that return Either, preventing from nested Eithers

const parse = (input: string) =>
  // parses JSON but catches error and returns left instead
  parseJSON(input, () => new Error('invalid json'))

const validateUser = (payload: unknown): Either<Error, User> =>
  isUser(payload) ? right(payload) : left(new Error('invalid payload'))

// see the resulting types when using map & chain
const x = pipe('{"name": "Mark"}', parse, map(validateUser))

const y = pipe('{"name": "Mark"}', parse, chain(validateUser))

// mapLeft
//
// as the name implies, allows to transform the left side (instead of the right one)

const leftErrorMessage = mapLeft((e: Error) => e.message)

// getOrElse
//
// extract values out of Either providing a default to use in case of left

const extract = getOrElse(() => ({name: 'John Doe'}))

console.log(extract(y))

// fold
//
// extract values out of Either handling both cases

pipe(
  y,
  leftErrorMessage,
  fold(
    msg => {
      console.log('The error was:', msg)
    },
    user => {
      console.log('User name is:', user.name)
    },
  ),
)

// fromNullable
//
// gets a nullable value and returns
// - right if it's not null|undefined
// - left (with the provided value) otherwise

fromNullable(() => 'is nullable')(123) // right(123)
fromNullable(() => 'is nullable')(null) // left('is nullable')

// fromPredicate
//
// creates Either by checking value with refinement

const validateUserByPredicate = fromPredicate(
  isUser,
  () => new Error('invalid payload'),
)

// tryCatch
//
// runs operation that might throw
// returns right of result if it doesn't
// catches error and returns left if it does

const eitherLowRandom = tryCatch(
  () => {
    const rand = Math.random()
    if (rand > 0.5) {
      throw new Error('random too high')
    }

    return rand
  },
  (error: unknown) =>
    error instanceof Error ? error : new Error('random too high'),
)

// Exercises ///////////////////////////////////////////////////////////////////

// 1. Implement a version of parseInt that returns a right on valid number
//    and a left if the result is not a number
//    Answer is in the fp-ts docs, don't cheat ;)

// 2. Implement a safe version of JSON.stringify that doesn't throw on cyclick
//    values but instead returns a left
//    NOTE: fp-ts/lib/Either already provides such function, this is for
//    learning purposes :)

const failsToStringify = {foo: this}

// 3. Using the decoder from the previous 'chapter', implement a function that:
//    - safely parses JSON
//    - decodes the result as PaymentMethod
//    - validates the expiry date (with isValidExpiry)

const isValidExpiry = (expiry: Expiry): Either<Error, Expiry> => {
  const currentYear = new Date().getFullYear()
  if (expiry.year < currentYear) {
    return left(new Error('year cannot be in the past'))
  }
  if (expiry.year > currentYear + 10) {
    return left(new Error('all credit cards expire in less than 10 years'))
  }
  if (expiry.month < 1 || expiry.month > 12) {
    return left(new Error('month should be between 1 & 12'))
  }
  return right(expiry)
}

const input = {
  invalidJSON:
    '{type":"credit_card","owner":"John Don","number":"347954046610242","expiry":{"month":1,"year":2023}}',
  invalidPaymentMethod:
    '{"type":"credit_crd","owner":"John Don","number":"347954046610242","expiry":{"month":1,"year":2023}}',
  invalidExpiry:
    '{"type":"credit_card","owner":"John Don","number":"347954046610242","expiry":{"month":13,"year":2023}}',
  validCreditCard:
    '{"type":"credit_card","owner":"John Don","number":"347954046610242","expiry":{"month":1,"year":2023}}',
  validPaypal: '{"type":"paypal","email":"foo@bar.com"}',
}
