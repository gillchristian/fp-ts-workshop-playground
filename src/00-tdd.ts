import {of, head, last, tail, concat} from 'fp-ts/lib/NonEmptyArray'

// of :: a -> NonEmptyArray a
//
// head :: NonEmptyArray a -> a
// last :: NonEmptyArray a -> a
// tail :: NonEmptyArray a -> [a]
//
// concat :: ([a], NonEmptyArray a) -> NonEmptyArray a
// concat :: (NonEmptyArray a, [a]) -> NonEmptyArray a
