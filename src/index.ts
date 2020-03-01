import {right, map, fold} from 'fp-ts/lib/Either'
import {pipe} from 'fp-ts/lib/pipeable'
import * as E from 'fp-ts/lib/Eq'

pipe(
  right({name: 'John Doe'}),
  map(u => u.name),
  fold(console.error, console.log),
)

const eqUser = E.getStructEq({name: E.eqString, id: E.eqNumber})

const isSameUser = eqUser.equals({name: 'foo', id: 123}, {id: 123, name: 'foo'})

console.log('Is same user: ', isSameUser)
