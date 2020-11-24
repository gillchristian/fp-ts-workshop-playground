import {sequenceT} from 'fp-ts/lib/Apply'
import {pipe} from 'fp-ts/lib/pipeable'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as E from 'fp-ts/lib/Either'
import {Monoid, fold} from 'fp-ts/lib/Monoid'

const minLength = (s: string): E.Either<string, string> =>
  s.length >= 6 ? E.right(s) : E.left('at least 6 characters')

const oneCapital = (s: string): E.Either<string, string> =>
  /[A-Z]/g.test(s) ? E.right(s) : E.left('at least one capital letter')

const oneNumber = (s: string): E.Either<string, string> =>
  /[0-9]/g.test(s) ? E.right(s) : E.left('at least one number')

const applicativeValidation = E.getValidation(NEA.getSemigroup<string>())

// Either<string, number>                    -> cannot accumulate errors
// Validation<NonEmptyArray<string>, number> -> Either<NonEmptyArray<string>, number> -> we accumulate errors

type Validation<A> = E.Either<NEA.NonEmptyArray<string>, A>

function lift<E, A>(
  check: (a: A) => E.Either<E, A>,
): (a: A) => E.Either<NEA.NonEmptyArray<E>, A> {
  return a =>
    pipe(
      check(a),
      E.mapLeft(a => [a]),
    )
}

const getValidatorMonoid = <A>(): Monoid<(a: A) => Validation<A>> => ({
  empty: (a: A) => E.right(a),
  concat: (validatorA, validatorB) => (a: A) =>
    pipe(
      sequenceT(applicativeValidation)(validatorA(a), validatorB(a)),
      E.map(() => a),
    ),
})

const combineValidators = <A>(
  ...validators: Array<(a: A) => E.Either<string, A>>
) => fold(getValidatorMonoid<A>())(validators.map(lift))

const validatePassword = combineValidators(minLength, oneCapital, oneNumber)

// function validatePassword(
//   s: string,
// ): E.Either<NEA.NonEmptyArray<string>, string> {
//   return pipe(
//     sequenceT(applicativeValidation)(
//       lift(minLength)(s),
//       lift(oneCapital)(s),
//       lift(oneNumber)(s),
//     ), */
//     E.map(() => s),
//   )
// }

pipe(
  validatePassword('foo'),
  E.fold(
    errors => console.log(`Failed: \n- ${errors.join('\n- ')}`),
    pass => console.log(`Valid password ("${pass}")`),
  ),
)
