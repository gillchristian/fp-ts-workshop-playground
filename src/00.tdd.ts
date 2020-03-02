import {of, head, last, tail, concat} from 'fp-ts/lib/NonEmptyArray'

// NonEmptyArray a = [a]
//
// of :: a -> NonEmptyArray a
//
// head :: NonEmptyArray a -> a
// last :: NonEmptyArray a -> a
// tail :: NonEmptyArray a -> [a]
//
// concat :: ([a], NonEmptyArray a) -> NonEmptyArray a
// concat :: (NonEmptyArray a, [a]) -> NonEmptyArray a

const arr_ = of(1)
const arr = concat(arr_, [2, 3])

console.log('NonEmptyArray', arr)

// there's going always be a head (first) element
console.log('head', head(arr))
console.log('head', head(arr_))

// there's going always be a last element
console.log('last', last(arr))
console.log('last', last(arr_))

// tail (array without head) might be empty
console.log('tail', tail(arr))
console.log('tail', tail(arr_))
