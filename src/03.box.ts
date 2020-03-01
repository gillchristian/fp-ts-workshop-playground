interface Box<Data> {
  data: Data
}

// of :: a -> Box a
const of = <Data = unknown>(data: Data): Box<Data> => ({data})

// extract :: Box a -> a
const extract = <Data = unknown>(box: Box<Data>): Data => box.data

// show :: Box a -> string
const show = <A = unknown>({data}: Box<A>) => `Box(${data})`

const hello = of('hello')
const one = of(1)

// /////////////////////////////////////////////////////////////////////////////

// as with RemoteData we can define a way to transform what's inside the Box without extracting
//
// we'll call it 'map' as we want to _map_ from the contents from A to B

// map :: (a -> b) -> Box a -> Box b
const map = <Data = unknown, Result = unknown>(f: (data: Data) => Result) => (
  box: Box<Data>,
): Box<Result> => of(f(box.data))

const m1 = map((s: string) => s.length)(hello)
const m2 = map((n: number) => n + 2)(one)

console.log("map((s: string) => s.length)(Box('hello'))", show(m1))
console.log('map((n: number) => n + 2)(Box(1))', show(m2))

// /////////////////////////////////////////////////////////////////////////////

// map wouldn't work if we have a function that returns a Box:

// boxedLength :: string -> Box number
const boxedLength = (s: string) => of(s.length)

// boxedInc :: number -> Box number
const boxedInc = (n: number) => of(n + 1)

// similar to map, there's 'chain' this one lets us _chain_ the operations
// this is very similar to what we do with Promises:
//
// fetchUser(id)
//   .then(({ followers }) => fetchFollowers(followers))

// chain :: (a -> Box b) -> Box a -> Box b
const chain = <Data = unknown, Result = unknown>(
  f: (data: Data) => Box<Result>,
) => (box: Box<Data>): Box<Result> => f(box.data)

const c1 = chain(boxedLength)(hello)
const c2 = chain(boxedInc)(one)

console.log('\n---\n')

console.log("chain(boxedLength)(Box('hello')):", show(c1))
console.log('chain(boxedInc)(Box(1)):', show(c2))
