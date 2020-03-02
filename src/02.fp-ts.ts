import * as assert from 'assert-plus'
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

// Solutions ///////////////////////////////////////////////////////////////////

// 1.

const one = (_users: User[]) => []

console.log('Exercise 1) -> Catawiki users with email')

assert.strictEqual(one(users), [
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
])

// 2.

const two = (_users: User[]) => 0

console.log('Exercise 2) -> lots count')

assert.strictEqual(two(users), 15)

// 3.

const three = (_users: User[]) => []

console.log('Exercise 3) -> Users profile description')

assert.deepEqual(three(users), [
  'John Doe (Catawiki employee). Joined Sunday, February 21, 2010',
  'Charles Easton (pro seller). Joined Monday, June 18, 2018',
  'Kimora Simmons. Joined Friday, January 3, 2020',
  'Wanda Vang (Catawiki employee). Joined Wednesday, August 14, 2019',
])
