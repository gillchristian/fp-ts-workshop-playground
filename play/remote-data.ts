/**
 * States of the data fetched asynchronously from a remote resourse can be different (before, while, and after fetching it).
 *
 * The `RemoteData` type models that:
 *
 * ```ts
 * type RemoteData<Err, Data> = Idle | Loading | Success<Data> | Failure<Err>;
 * ```
 *
 * @since 0.0.1
 */
import * as Either from 'fp-ts/lib/Either'
import * as Option from 'fp-ts/lib/Option'
import {Eq} from 'fp-ts/lib/Eq'
import {Functor2} from 'fp-ts/lib/Functor'
import {Apply2} from 'fp-ts/lib/Apply'
import {Applicative2} from 'fp-ts/lib/Applicative'
import {Chain2} from 'fp-ts/lib/Chain'
import {Monad2} from 'fp-ts/lib/Monad'
import {Monoid} from 'fp-ts/lib/Monoid'
import {MonadThrow2} from 'fp-ts/lib/MonadThrow'
import {pipeable} from 'fp-ts/lib/pipeable'
import {flow, identity, constNull} from 'fp-ts/lib/function'

/**
 * @since 0.0.1
 */
export interface Idle {
  tag: 'idle'
}

/**
 * @since 0.0.1
 */
export interface Loading {
  tag: 'loading'
}

/**
 * @since 0.0.1
 */
export interface Success<Data> {
  tag: 'success'
  data: Data
}

/**
 * @since 0.0.1
 */
export interface Failure<Err> {
  tag: 'failure'
  error: Err
}

/**
 * @since 0.0.1
 */
export type RemoteData<Err, Data> =
  | Idle
  | Loading
  | Success<Data>
  | Failure<Err>

/**
 * Creates an `Idle` RemoteData.
 *
 * @since 0.0.1
 */
export const idle: RemoteData<any, any> = {tag: 'idle'}
/**
 * Creates a `Loading` RemoteData.
 *
 * @since 0.0.1
 */
export const loading: RemoteData<any, any> = {tag: 'loading'}

/**
 * Creates a `Failure` RemoteData.
 *
 * @since 0.0.1
 */
export const failure = <Err = unknown, Data = never>(
  error: Err,
): RemoteData<Err, Data> => ({
  tag: 'failure',
  error,
})
/**
 * Creates a `Success` RemoteData.
 *
 * @since 0.0.1
 */
export const success = <Err = never, Data = unknown>(
  data: Data,
): RemoteData<Err, Data> => ({
  tag: 'success',
  data,
})
/**
 * Creates a `Success` RemoteData.
 *
 * @since 0.0.1
 */
export const of = success

/**
 * @since 0.0.1
 */
export const isIdle = (rd: RemoteData<unknown, unknown>): rd is Idle =>
  rd.tag === 'idle'

/**
 * @since 0.0.1
 */
export const isLoading = (rd: RemoteData<unknown, unknown>): rd is Loading =>
  rd.tag === 'loading'

/**
 * @since 0.0.1
 */
export const isSuccess = (
  rd: RemoteData<unknown, unknown>,
): rd is Success<unknown> => rd.tag === 'success'

/**
 * @since 0.0.1
 */
export const isFailure = (
  rd: RemoteData<unknown, unknown>,
): rd is Failure<unknown> => rd.tag === 'failure'

interface Matcher<Err, Data, Result> {
  idle: () => Result
  loading: () => Result
  success: (data: Data) => Result
  failure: (error: Err) => Result
}

/**
 * Extract a value from RemoteData by pattern matching on the different cases.
 *
 * ```tsx
 * type RenderUser = (user: RemoteData<string, User>) => ReactNode;
 *
 * const renderUser: RenderUser = fold({
 *   idle: () => <IdleMessage />,
 *   loading: () => <Loading />,
 *   success: user => <UserCard {...user} />,
 *   failure: error => <ErrorMessage error={error} />,
 * });
 *
 * renderUser(idle);
 * renderUser(loading);
 * renderUser(success({ id: 1234, name: 'Jane Doe' }));
 * renderUser(failure('404 - Not found'));
 * ```
 *
 * @since 0.0.1
 */
export const fold = <Err = unknown, Data = unknown, Result = unknown>(
  matcher: Matcher<Err, Data, Result>,
) => (rd: RemoteData<Err, Data>): Result => {
  if (isIdle(rd)) {
    return matcher.idle()
  }

  if (isLoading(rd)) {
    return matcher.loading()
  }

  if (isSuccess(rd)) {
    return matcher.success(rd.data)
  }

  return matcher.failure(rd.error)
}

/**
 * @since 0.0.1
 */
export const URI = 'RemoteData'
/**
 * @since 0.0.1
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly RemoteData: RemoteData<E, A>
  }
}

const map_ = <Err = unknown, A = unknown, B = unknown>(
  remoteDataA: RemoteData<Err, A>,
  f: (a: A) => B,
): RemoteData<Err, B> =>
  fold<Err, A, RemoteData<Err, B>>({
    idle: () => idle,
    loading: () => loading,
    success: data => success(f(data)),
    failure,
  })(remoteDataA)

const ap_ = <Err = unknown, A = unknown, B = unknown>(
  rdf: RemoteData<Err, (a: A) => B>,
  rda: RemoteData<Err, A>,
): RemoteData<Err, B> =>
  fold<Err, A, RemoteData<Err, B>>({
    idle: () => idle,
    loading: () => loading,
    success: a => map<(a: A) => B, B>(f => f(a))(rdf),
    failure,
  })(rda)

const chain_ = <Err = unknown, A = unknown, B = unknown>(
  rda: RemoteData<Err, A>,
  f: (a: A) => RemoteData<Err, B>,
): RemoteData<Err, B> =>
  fold<Err, A, RemoteData<Err, B>>({
    idle: () => idle,
    loading: () => loading,
    success: a => f(a),
    failure,
  })(rda)

/**
 * The [fp-ts typeclasses](https://paulgray.net/typeclasses-in-typescript/) implemented by RemoteData.
 *
 * - [Functor](https://gcanti.github.io/fp-ts/modules/Functor.ts.html)
 * - [Apply](https://gcanti.github.io/fp-ts/modules/Apply.ts.html) / [Applicative](https://gcanti.github.io/fp-ts/modules/Applicative.ts.html)
 *
 * @since 0.0.1
 */
export const remoteData: Functor2<URI> &
  Apply2<URI> &
  Applicative2<URI> &
  Chain2<URI> &
  Monad2<URI> &
  MonadThrow2<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of: success,
  chain: chain_,
  throwError: failure,
}

const {
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  filterOrElse,
  flatten,
  fromEither,
  fromOption,
  fromPredicate,
  map,
} = pipeable(remoteData)

export {
  /**
   * @since 0.0.1
   */
  ap,
  /**
   * Given two RemoteData values (remoteDataA & remoteDataB): Discard the 1st and return the 2nd (as long as the 1st is a Success).
   *
   * ```
   * remoteDataA == Success -> return remoteDataB
   * remoteDataA != Success -> return remoteDataA
   * ```
   *
   * `apFirst` is meant to be used with `pipe`, which could be seen as a replacement for methods. So
   *
   * ```ts
   * pipe(
   *   remoteDataA,
   *   apFirst(remoteDataB)
   * )
   * ```
   *
   * would be something like
   *
   * ```ts
   * remoteDataA.apFirst(remoteDataB)
   * ```
   *
   * @since 0.0.1
   */
  apFirst,
  /**
   * Given two RemoteData values (remoteDataA & remoteDataB): Discards the 2nd and returns the 1st (as long as the 2nd is a Success).
   *
   * ```
   * remoteDataB == Success -> return remoteDataA
   * remoteDataB != Success -> return remoteDataB
   * ```
   *
   * `apSecond` is meant to be used with `pipe`, which could be seen as a replacement for methods. So
   *
   * ```ts
   * pipe(
   *   remoteDataA,
   *   apSecond(remoteDataB)
   * )
   * ```
   *
   * would be something like
   *
   * ```ts
   * remoteDataA.apSecond(remoteDataB)
   * ```
   *
   * @since 0.0.1
   */
  apSecond,
  /**
   * Chain allows to transform a RemoteData value by using the data inside it:
   *
   * ```ts
   * type chain = (A => RemoteData<Err, B>) => RemoteData<Err, A> => RemoteData<Err, B>
   * ```
   *
   * The transformation is only applied when on the success branch, otherwise returns the RemoteData unchanged.
   *
   * It is similar to map but the chaining function returns `RemoteData<B>` instead of `B`. This allows to change not only the data contained in the case of `Success` but also to change to another branch.
   *
   * @example
   * import { chain, success, idle, loading, failure } from 'remote-data-ts'
   *
   * const f = (s: string) => s === 'foo' ? loading : idle
   *
   * assert.deepStrictEqual(f('foo'), loading)
   * assert.deepStrictEqual(f('bar'), idle)
   *
   * assert.deepStrictEqual(chain(f)(success('foo')), loading)
   * assert.deepStrictEqual(chain(f)(success('bar')), idle)
   * assert.deepStrictEqual(chain(f)(idle), idle)
   * assert.deepStrictEqual(chain(f)(loading), loading)
   * assert.deepStrictEqual(chain(f)(failure('error')), failure('error'))
   *
   * @since 0.0.1
   */
  chain,
  /**
   *
   * @since 0.0.1
   */
  chainFirst,
  /**
   *
   * @since 0.0.1
   */
  filterOrElse,
  /**
   *
   * @since 0.0.1
   */
  flatten,
  /**
   *
   * @since 0.0.1
   */
  fromEither,
  /**
   *
   * @since 0.0.1
   */
  fromOption,
  /**
   *
   * @since 0.0.1
   */
  fromPredicate,
  /**
   * Map allows to transform the data inside RemoteData
   *
   * ```ts
   * type map = (A => B) => RemoteData<A> => RemoteData<B>
   * ```
   *
   * Only transforms the inner data when on the success branch, otherwise returns the RemoteData unchanged.
   *
   * @example
   * import { map } from 'remote-data-ts'
   *
   * const len = (s: string) => s.length
   * len('foo') // 3
   *
   * map(len)(success('foo')) // success(3)
   * map(len)(idle)           // idle
   * map(len)(loading)        // loading
   * map(len)(failure(error)) // failure(error)
   *
   * @since 0.0.1
   */
  map,
}

/**
 * Allows to transform the failure branch into a success one
 *
 * ```
 * remoteDataA == Success -> return remoteDataB
 * remoteDataA != Success -> return remoteDataA
 * ```
 *
 * @since 0.0.1
 */
export const mapFailureToSuccess = <Err = unknown, A = unknown>(
  f: (error: Err) => A,
) => (remoteDataA: RemoteData<Err, A>): RemoteData<never, A> =>
  fold<Err, A, RemoteData<never, A>>({
    idle: () => idle,
    loading: () => loading,
    success,
    failure: error => success(f(error)),
  })(remoteDataA)

/**
 * Transforms a `RemoteData<A>` to a nullable value (`A | null`), returning `A` on the Success case and `null` otherwise.
 *
 * @example
 * import { idle, loading, success, failure, toNullable } from 'remote-data-ts'
 *
 * assert.strictEqual(toNullable(idle), null)
 * assert.strictEqual(toNullable(loading), null)
 * assert.strictEqual(toNullable(success('123')), '123')
 * assert.strictEqual(toNullable(failure('error')), null)
 *
 * @since 0.0.1
 */
export const toNullable = <Err = unknown, A = unknown>(
  remoteDataA: RemoteData<Err, A>,
): A | null =>
  fold<Err, A, A | null>({
    idle: constNull,
    loading: constNull,
    success: identity,
    failure: constNull,
  })(remoteDataA)

/**
 * Transforms a `RemoteData<A>` to a `Option<A>`.
 *
 * @example
 * import { some, none } from 'fp-ts/lib/Option'
 * import { success, idle, loading, failure, toOption } from 'remote-data-ts'
 *
 * assert.deepStrictEqual(toOption(success('foo')), some('foo'))
 * assert.deepStrictEqual(toOption(idle), none)
 * assert.deepStrictEqual(toOption(loading), none)
 * assert.deepStrictEqual(toOption(failure('error')), none)
 *
 * @since 0.0.1
 */
export const toOption = flow(toNullable, Option.fromNullable)

/**
 * Transforms a `RemoteData<A>` to a `Either<E, A>`.
 *
 * @example
 * import { right, left } from 'fp-ts/lib/Either'
 * import { success, idle, loading, failure, toEither } from 'remote-data-ts'
 *
 * const toError = toEither<'idle' | 'loading' | 'failure'>(
 *   (status) => status,
 *   (_failure) => 'failure'
 * )
 *
 * assert.deepStrictEqual(toError(success('foo')), right('foo'))
 * assert.deepStrictEqual(toError(idle), left('idle'))
 * assert.deepStrictEqual(toError(loading), left('loading'))
 * assert.deepStrictEqual(toError(failure('error')), left('error'))
 *
 * @since 0.0.1
 */
export const toEither = <Err = unknown, L = unknown>(
  onNone: (status: 'idle' | 'loading') => L,
  onFailure: (err: Err) => L,
) => <A = unknown>(remoteDataA: RemoteData<Err, A>): Either.Either<L, A> =>
  fold<Err, A, Either.Either<L, A>>({
    idle: () => Either.left(onNone('idle')),
    loading: () => Either.left(onNone('loading')),
    success: Either.right,
    failure: flow(Either.left, Either.mapLeft(onFailure)),
  })(remoteDataA)

/**
 * Get an [fp-ts Eq](https://gcanti.github.io/fp-ts/modules/Eq.ts.html) instance.
 *
 * @example
 * import { idle, loading, success, failure, getEq } from 'remote-data-ts'
 * import { eqNumber, eqString } from 'fp-ts/lib/Eq'
 *
 * const E = getEq(eqString, eqNumber)
 *
 * assert.strictEqual(E.equals(idle, idle), true)
 * assert.strictEqual(E.equals(loading, success(1)), false)
 * assert.strictEqual(E.equals(failure('foo'), failure('foo')), true)
 * assert.strictEqual(E.equals(failure('foo'), failure('bar')), false)
 * assert.strictEqual(E.equals(success(1), idle), false)
 * assert.strictEqual(E.equals(success(1), success(2)), false)
 * assert.strictEqual(E.equals(success(1), success(1)), true)
 *
 * @since 0.0.1
 */
export function getEq<Err, A>(
  eqErr: Eq<Err>,
  eqA: Eq<A>,
): Eq<RemoteData<Err, A>> {
  return {
    equals: (x, y) =>
      x === y
        ? true
        : isIdle(x)
        ? isIdle(y)
        : isLoading(x)
        ? isLoading(y)
        : isFailure(x)
        ? isFailure(y) && eqErr.equals(x.error, y.error)
        : isSuccess(y) && eqA.equals(x.data, y.data),
  }
}

type FirstMonoid<Err, A> = Monoid<RemoteData<Err, A>>

export const getFirstMonoid = <Err = unknown, A = unknown>(): FirstMonoid<
  Err,
  A
> => ({
  empty: idle,
  concat: (rda, rdb) => {
    if (isSuccess(rda)) {
      return rda
    }

    if (isSuccess(rdb)) {
      return rdb
    }

    if (isFailure(rda)) {
      return rda
    }

    if (isFailure(rdb)) {
      return rdb
    }

    if (isLoading(rda)) {
      return rda
    }

    if (isLoading(rdb)) {
      return rdb
    }

    return idle
  },
})

const firstMonoid = getFirstMonoid<string, number>()

firstMonoid.concat(success(1), success(2)) // success(1)
firstMonoid.concat(success(1), failure('a')) // success(1)
firstMonoid.concat(failure('a'), success(1)) // success(1)
firstMonoid.concat(success(1), success(2)) // success(1)
firstMonoid.concat(success(1), idle) // success(1)
firstMonoid.concat(loading, success(1)) // success(1)

firstMonoid.concat(loading, failure('a')) // idle
firstMonoid.concat(failure('a'), failure('b')) // idle
firstMonoid.concat(loading, loading) // idle
firstMonoid.concat(idle, idle) // idle

// import {pipe} from 'fp-ts/lib/pipeable'

// interface User {
//   name: string
// }

// const someRd: RemoteData<string, User>  = success({ name: 'Tuvie' })

// const foo = pipe(
//   someRd,
//   fold({
//     idle: () => 'idle',
//     loading: () => 'loading',
//     success: (user) => user.name,
//     failure: (msg) => msg,
//   }),
//   v => v,
// )
