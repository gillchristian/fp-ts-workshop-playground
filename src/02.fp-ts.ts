import {
  flow,
  identity,
  not,
  constant,
  // these are the types you'll see fp-ts use for some functions
  // TS will match anyways, no need to explicitly type things with them
  // just know what they are if any operation takes one of them
  Lazy,
  Predicate,
  Refinement,
  Endomorphism,
} from 'fp-ts/lib/function'
import {pipe} from 'fp-ts/lib/pipeable'
import {map, reduce, filter, array} from 'fp-ts/lib/Array'

const toLower = (str: string) => str.toLowerCase()
const exclaim: Endomorphism<string> = str => `${str}!`

const isExclamation: Predicate<string> = str => /!$/.test(str)

const alwaysNull: Lazy<null> = () => null

const isSrgjan: Refinement<string, 'Srgjan'> = (str): str is 'Srgjan' =>
  str === 'Srgjan'

// /////////////////////////////////////////////////////////////////////////////

const name = 'Srgjan'
const nameConst = isSrgjan(name) ? name : 'Srgjan'

interface User {
  name: string
  lastName: string
  admin: boolean
  lots: number
  isPro: boolean
  registered: string
}

const userFormatRegistered = (user: User) =>
  new Date(user.registered).toLocaleDateString('en-gb', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const users = [
  {
    name: 'John',
    lastName: 'Doe',
    admin: true,
    lots: 0,
    isPro: false,
    registered: '2010-02-21',
  },
  {
    name: 'Charles',
    lastName: 'Easton',
    admin: false,
    lots: 10,
    isPro: true,
    registered: '2018-06-18',
  },
  {
    name: 'Kimora',
    lastName: 'Simmons',
    admin: false,
    lots: 2,
    isPro: false,
    registered: '2020-01-03',
  },
  {
    name: 'Wanda',
    lastName: 'Vang',
    admin: true,
    lots: 3,
    isPro: false,
    registered: '2019-08-14',
  },
]

interface CatawikiUser extends User {
  email: string
}

// Exercises ///////////////////////////////////////////////////////////////////

// 1. List of Catawiki employees (admins) with their emails (name's initial + last name + @catawiki.com)
// 2. Count the amount of lots
// 3. For user's profile pretty print name + date -> 'Charles Easton (pro seller), joined ...
//                                                -> 'Wanda Vang (catawiki employee), joined ...
// 4. Play around with pipe & flow, creat and compose functions

const add = (a: number, b: number) => a + b
const firstChar = (name: string) => name.charAt(0)
const initial = flow(firstChar, toLower)
const toLocaleDateString = (date: string) =>
  new Date(date).toLocaleDateString('en-gb', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
const join = (what: string) => (xs: string[]) => xs.join(what)

const isAdmin = ({admin}: {admin: boolean}) => admin
const userEmail = ({name, lastName}: {name: string; lastName: string}) =>
  `${initial(name)}.${lastName.toLowerCase()}@catawiki`

const cataUser = (user: User): CatawikiUser => ({
  ...user,
  email: userEmail(user),
})

const lots = ({lots}: {lots: number}) => lots

const formatRegistrationDate = ({registered, ...rest}: User) => ({
  ...rest,
  registered: toLocaleDateString(registered),
})

const profileIntroParts = ({name, lastName, isPro, admin, registered}: User) =>
  admin
    ? [name, lastName, '(Catawiki employee). Joined', registered]
    : isPro
    ? [name, lastName, '(pro seller). Joined', registered]
    : [name, `${lastName}.`, 'Joined', registered]

// Solutions

const one = flow(filter(isAdmin as Predicate<User>), map(cataUser))

const two = flow(map(lots), reduce(0, add))

const three = map(flow(formatRegistrationDate, profileIntroParts, join(' ')))

console.log('With email:\n', one(users), '\n')

console.log('Lots count:', two(users), '\n')

console.log('Profiles:\n', three(users))
