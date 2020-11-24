import * as t from 'io-ts'
import {fold} from 'fp-ts/lib/Either'

const PathReporter = {
  report: (...errors: any[]) => console.log(...errors),
}

const Product = t.interface({name: t.string})
type Product = t.TypeOf<typeof Product>

export const getUser = () => {
  return Promise.resolve('{"name": "John Doe"}')
    .then(res => JSON.parse(res))
    .then(parsed => Product.decode(parsed))
    .then(
      fold(
        errors => Promise.reject(PathReporter.report(errors)),
        (product: Product) => Promise.resolve(product),
      ),
    )
}

export const getUserExplicitFold = () => {
  return Promise.resolve('{"name": "John Doe"}')
    .then(res => JSON.parse(res))
    .then(parsed => Product.decode(parsed))
    .then(result =>
      fold(
        // errors => Promise.reject(PathReporter.report(errors)),
        _errors => Promise.reject(PathReporter.report(result)),
        (product: Product) => Promise.resolve(product),
      )(result),
    )
}
