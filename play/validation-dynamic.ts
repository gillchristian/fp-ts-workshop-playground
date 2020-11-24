import * as m from 'monocle-ts'
import {sequenceT, sequenceS} from 'fp-ts/lib/Apply'
import {
  Either,
  getValidation,
  left,
  map,
  mapLeft,
  right,
  getShow,
  either,
  fold,
} from 'fp-ts/lib/Either'
import {showString} from 'fp-ts/lib/Show'
import {
  getSemigroup,
  NonEmptyArray,
  getShow as getShowNEA,
} from 'fp-ts/lib/NonEmptyArray'
import * as R from 'fp-ts/lib/Record'
import {pipe} from 'fp-ts/lib/pipeable'
import {flow} from 'fp-ts/lib/function'

const minLength = (s: string): Either<string, string> =>
  s.length >= 6 ? right(s) : left('at least 6 characters')

const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left('at least one capital letter')

const oneNumber = (s: string): Either<string, string> =>
  /[0-9]/g.test(s) ? right(s) : left('at least one number')

const isEmail = (s: string): Either<string, string> =>
  /^[a-zA-Z.-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/g.test(s)
    ? right(s)
    : left('invalid email')

function lift<L, A>(
  check: (a: A) => Either<L, A>,
): (a: A) => Either<NonEmptyArray<L>, A> {
  return a =>
    pipe(
      check(a),
      mapLeft(a => [a]),
    )
}

function validatePassword(s: string): Either<NonEmptyArray<string>, string> {
  return pipe(
    sequenceT(getValidation(getSemigroup<string>()))(
      lift(minLength)(s),
      lift(oneCapital)(s),
      lift(oneNumber)(s),
    ),
    map(() => s),
  )
}

const {show} = getShow(getShowNEA(showString), showString)

console.log(show(validatePassword('ab')))

// /////////////////////////////////////////////////////////////////////////////

type Validation<A> = Either<NonEmptyArray<string>, A>

type Validations<Form extends Record<string, any>> = {
  [K in keyof Form]: (form: Form) => Validation<Form[K]>
}

type Result<Form extends Record<string, any>> = {
  [K in keyof Form]: Validation<Form[K]>
}

declare type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

function validateForm<Form extends Record<string, any>>(
  form: EnforceNonEmptyRecord<Form>,
  validations: EnforceNonEmptyRecord<Validations<Form>>,
): Either<EnforceNonEmptyRecord<Result<Form>>, EnforceNonEmptyRecord<Form>> {
  const validated = pipe(
    form,
    R.mapWithIndex((key, value) => validations[key](value)),
  ) as EnforceNonEmptyRecord<Result<Form>>

  return pipe(
    // TODO: remove this any and make sure everything type checks
    sequenceS(either)(validated as any),
    mapLeft(() => validated),
    map(() => form),
  )
}

interface OurForm {
  email: string
  email_confirm: string
  password: string
}

const password = m.Lens.fromProp<OurForm>()('password')
const mail = m.Lens.fromProp<OurForm>()('email')

const result = validateForm(
  {
    password: 'abasdfaA1',
    email: 'foo@gmail.com',
    email_confirm: 'foo@hotmail.com',
  },
  {
    password: flow(password.get, validatePassword),
    email: flow(mail.get, lift(isEmail)),
    email_confirm: ({email_confirm, email}) =>
      email === email_confirm ? right(email_confirm) : left(['Needs to match']),
  },
)

console.log(JSON.stringify(result, null, 2))

pipe(
  result,
  fold(
    validationResult => console.log(validationResult),
    form => console.log(form),
  ),
)
