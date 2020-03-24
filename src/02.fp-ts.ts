import * as assert from 'assert-plus'
import {
  flow,
  // these are the types you'll see fp-ts use for some functions
  // TS will match anyways, no need to explicitly type things with them
  // just know what they are if any operation takes one of them
  Lazy,
  Predicate,
  Refinement,
  Endomorphism,
} from 'fp-ts/lib/function'
import {pipe} from 'fp-ts/lib/pipeable'
import {map, reduce, filter} from 'fp-ts/lib/Array'

import * as utils from './utils'

export const toLower = (str: string) => str.toLowerCase()
export const exclaim: Endomorphism<string> = str => `${str}!`

export const isExclamation: Predicate<string> = str => /!$/.test(str)

export const alwaysNull: Lazy<null> = () => null

const isSrgjan: Refinement<string, 'Srgjan'> = (str): str is 'Srgjan' =>
  str === 'Srgjan'

// /////////////////////////////////////////////////////////////////////////////

const name = 'Srgjan'
export const nameConst = isSrgjan(name) ? name : 'Srgjan'

interface User {
  name: string
  lastName: string
  admin: boolean
  lots: number
  isPro: boolean
  registered: string
}

export const userFormatRegistered = (user: User) =>
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

// Exercises ///////////////////////////////////////////////////////////////////

// 1. List of Catawiki employees (admins) with their emails (name's initial + last name + @catawiki.com)
interface CatawikiUser extends User {
  email: string
}

// 2. Count the amount of lots

// 3. For user's profile pretty print name + date -> 'Charles Easton (pro seller), joined ...
//                                                -> 'Wanda Vang (catawiki employee), joined ...

// 4. Play around with pipe & flow, creat and compose functions

const add = (a: number, b: number) => a + b

const firstChar = (name: string) => name.charAt(0)

const initial = flow(firstChar, toLower)

const join = (what: string) => (xs: string[]) => xs.join(what)

// re-implemented to take a 'data' instead of User
// now it can be used on any date not only 'user.registered'
const toLocaleDateString = (date: string) =>
  new Date(date).toLocaleDateString('en-gb', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const makeEmail = ({name, lastName}: {name: string; lastName: string}) =>
  `${initial(name)}.${toLower(lastName)}@catawiki`

// Solutions ///////////////////////////////////////////////////////////////////

// 1.

utils.test('Exercise 1: Catawiki users with email', () => {
  const isAdmin = ({admin}: User) => admin

  const makeCatawikiUser = (user: User): CatawikiUser => ({
    ...user,
    email: makeEmail(user),
  })

  const onePipe = (users: User[]) =>
    pipe(users, filter(isAdmin), map(makeCatawikiUser))
  const one = flow(filter(isAdmin), map(makeCatawikiUser))

  const oneSolution = [
    {
      name: 'John',
      lastName: 'Doe',
      admin: true,
      lots: 0,
      isPro: false,
      registered: '2010-02-21',
      email: 'j.doe@catawiki',
    },
    {
      name: 'Wanda',
      lastName: 'Vang',
      admin: true,
      lots: 3,
      isPro: false,
      registered: '2019-08-14',
      email: 'w.vang@catawiki',
    },
  ]
  assert.deepEqual(one(users), oneSolution)
  assert.deepEqual(onePipe(users), oneSolution)
})

// 2.

utils.test('Exercise 2: lots count', () => {
  const lots = ({lots}: {lots: number}) => lots

  const twoPipe = (users: User[]) => pipe(users, map(lots), reduce(0, add))
  const two = flow(map(lots), reduce(0, add))

  assert.strictEqual(two(users), 15)
  assert.strictEqual(twoPipe(users), 15)
})

// 3.

utils.test('Exercise 3: Users profile description', () => {
  const formatRegistrationDate = ({registered, ...rest}: User) => ({
    ...rest,
    registered: toLocaleDateString(registered),
  })

  const profileIntoParts = ({name, lastName, isPro, admin, registered}: User) =>
    admin
      ? [name, lastName, '(Catawiki employee). Joined', registered]
      : isPro
      ? [name, lastName, '(pro seller). Joined', registered]
      : [name, `${lastName}.`, 'Joined', registered]

  const userDescriptionPipe = (user: User) =>
    pipe(user, formatRegistrationDate, profileIntoParts, join(' '))

  const userDescription = flow(
    formatRegistrationDate,
    profileIntoParts,
    join(' '),
  )

  const threePipe = map(userDescriptionPipe)
  const three = map(userDescription)

  const threeSolution = [
    'John Doe (Catawiki employee). Joined Sunday, February 21, 2010',
    'Charles Easton (pro seller). Joined Monday, June 18, 2018',
    'Kimora Simmons. Joined Friday, January 3, 2020',
    'Wanda Vang (Catawiki employee). Joined Wednesday, August 14, 2019',
  ]

  assert.deepEqual(threePipe(users), threeSolution)
  assert.deepEqual(three(users), threeSolution)
})
