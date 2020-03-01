import {right, left, map, fold, tryCatch} from 'fp-ts/lib/Either'

// type Either<E, D> =
//   | { tag: 'left', error: e }
//   | { tag: 'right', data: d }

// Either e d =
//     Left e
//   | Right d

// right :: d -> Either e d
// left :: e -> Either e d
//
// map :: (a -> b) -> Either e a -> Either e b
//
// fold :: (e -> b) -> (a -> b) -> Either e a -> b
//
// tryCatch :: (() -> a) -> (unknown -> e) -> Either e a
