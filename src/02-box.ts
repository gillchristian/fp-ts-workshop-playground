interface Box<Data> {
  data: Data
}

// of :: a -> Box a
const of = <Data>(data: Data): Box<Data> => ({data})

// ---

// extract :: Box a -> a
const extract = <Data>(box: Box<Data>): Data => box.data

// ---

const hello = of('hello')
const one = of(1)

extract(hello) // 'hello'
extract(one) // 1

// ---

// transform :: (a -> b) -> Box a -> Box b
const transform = <Data, Result>(f: (data: Data) => Result) => (
  box: Box<Data>,
): Box<Result> => of(f(box.data))

const t1 = transform<string, number>(s => s.length)(hello)
const t2 = transform((s: string) => s.length)(hello)
const t3 = transform((s: string) => s.length)(one)

// ---

// chain :: (a -> Box b) -> Box a -> Box b
const chain = <Data, Result>(f: (data: Data) => Box<Result>) => (
  box: Box<Data>,
): Box<Result> => f(box.data)

const c1 = chain<string, number>(s => of(s.length))(hello)
const c2 = chain((s: string) => of(s.length))(hello)
const c3 = chain((s: string) => of(s.length))(one)
