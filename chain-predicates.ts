import {
  monoidAll,
  monoidAny,
  monoidString,
  monoidSum,
  monoidProduct,
  fold,
  Monoid,
} from 'fp-ts/lib/Monoid'
import {pipe} from 'fp-ts/lib/pipeable'
import {foldMap} from 'fp-ts/lib/Array'
import {Predicate} from 'fp-ts/lib/function'

interface SpecificationType {
  input_type: {
    multi: boolean
  }
  values: string[]
}

fold(monoidString)(['a', 'b']) // 'ab'
fold(monoidSum)([1, 2]) // 3
fold(monoidProduct)([1, 2]) // 2

fold(monoidAll)([true, false]) // false
fold(monoidAny)([true, false]) // true

const isSingle = (spec: SpecificationType) => !spec.input_type.multi

const hasEnoughItemsForSelect = (spec: SpecificationType) =>
  spec.values.length >= 10

export const isSingleSelectField = (spec: SpecificationType) =>
  pipe(
    [isSingle, hasEnoughItemsForSelect],
    foldMap(monoidAll)(f => f(spec)),
  )

const getMonoidPredicateAll = <A>(): Monoid<Predicate<A>> => ({
  concat: (fa, fb): Predicate<A> => (a: A) => fa(a) && fb(a),
  empty: (_a: A) => true,
})

export const getMonoidPredicateAny = <A>(): Monoid<Predicate<A>> => ({
  concat: (fa, fb): Predicate<A> => (a: A) => fa(a) || fb(a),
  empty: (_a: A) => false,
})

const monoidPredicateAllSpecificationType = getMonoidPredicateAll<
  SpecificationType
>()

export const isSingleSelectField2 = fold(monoidPredicateAllSpecificationType)([
  isSingle,
  hasEnoughItemsForSelect,
])

export const isSingleSelectField1 = monoidPredicateAllSpecificationType.concat(
  monoidPredicateAllSpecificationType.concat(isSingle, hasEnoughItemsForSelect),
  hasEnoughItemsForSelect,
)

export const any = <A = unknown>(predicates: Array<(a: A) => boolean>) => (
  a: A,
) => predicates.some(predicate => predicate(a))

export const all = <A = unknown>(predicates: Array<(a: A) => boolean>) => (
  a: A,
) => predicates.every(predicate => predicate(a))

export const isSingleSelectField3 = all([isSingle, hasEnoughItemsForSelect])

const and = <A>(pa: (a: A) => boolean) => (pb: (a: A) => boolean) => (a: A) =>
  pa(a) && pb(a)

export const isSingleSelectField4 = and(and(isSingle)(hasEnoughItemsForSelect))(
  hasEnoughItemsForSelect,
)

export const isSingleSelectField5 = pipe(
  hasEnoughItemsForSelect,
  and(isSingle),
  and(hasEnoughItemsForSelect),
)
