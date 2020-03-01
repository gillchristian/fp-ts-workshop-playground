// this way of modeling async state can lead to inconsistent states
interface AsyncData<D> {
  isLoading: boolean
  didLoad: boolean
  data?: D
  error?: Error
}

// compiles but doesn't make sense
const wrong: AsyncData<string> = {
  isLoading: true,
  didLoad: false,
  data: 'John Doe',
  error: new Error('Failed to fetch'),
}

// discriminated union (a.k.a. algebraic data type)
type RemoteData<Data> =
  | {tag: 'idle'}
  | {tag: 'loading'}
  | {tag: 'success'; data: Data}
  | {tag: 'failure'; error: Error}

const idle: RemoteData<string> = {tag: 'idle'}
const loading: RemoteData<string> = {tag: 'loading'}
const success: RemoteData<string> = {tag: 'success', data: 'John Doe'}
const failure: RemoteData<string> = {
  tag: 'failure',
  error: new Error('Failed to fetch'),
}

// we are going to want to operate inside the RemoteData only when we have a success
const transform = <Data, Result>(f: (data: Data) => Result) => (
  rd: RemoteData<Data>,
): RemoteData<Result> => {
  if (rd.tag === 'success') {
    return {tag: 'success', data: f(rd.data)}
  }

  return rd
}

interface User {
  name: string
}

console.log(
  "transform(s => s.name)(success({name: 'Bora' }))\n",
  transform<User, string>(s => s.name)({
    tag: 'success',
    data: {name: 'Bora'},
  }),
  '\n',
)
console.log(
  'transform(s => s.name)(loading)\n',
  transform((s: string) => s.toUpperCase())({tag: 'loading'}),
  '\n',
)
console.log(
  'transform(s => s.name)(idle)\n',
  transform((s: string) => s.toUpperCase())({tag: 'idle'}),
  '\n',
)
console.log(
  "transform(s => s.name)(failure(new Error('foo')))\n",
  transform((s: string) => s.toUpperCase())({
    tag: 'failure',
    error: new Error('foo'),
  }),
  '\n',
)
