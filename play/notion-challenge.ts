import * as assert from 'assert-plus'
import * as O from 'fp-ts/lib/Option'
import {pipe} from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/Array'

interface FileImports {
  name: string
  deps: string[]
}

type DependencyTree = FileImports[]

const files: DependencyTree = [
  {name: 'index.js', deps: ['foo.js', 'bar.js']},
  {name: 'foo.js', deps: ['foo1.js', 'bar.js']},
  {name: 'bar.js', deps: ['bar1.js', 'foo.js']},
]

export const getDependencies = (files: DependencyTree) => (
  name: string,
): string[] =>
  pipe(
    files,
    A.findFirst(file => file.name === name),
    O.map(file => file.deps),
    O.map(deps =>
      pipe(deps, A.map(getDependencies(files)), rest => A.cons(deps, rest)),
    ),
    v => (console.log(v), v),
    O.map(A.flatten),
    O.getOrElse((): string[] => []),
    deps => A.cons(name, deps),
  )

const index = ['index.js', 'foo.js', 'bar.js', 'foo1.js', 'bar1.js']
assert.deepEqual(getDependencies(files)('index.js'), index)

const foo = ['foo.js', 'foo1.js', 'bar.js', 'bar1.js']
assert.deepEqual(getDependencies(files)('foo.js'), foo)

const bar = ['bar.js', 'bar1.js', 'foo.js', 'foo1.js']
assert.deepEqual(getDependencies(files)('bar.js'), bar)
