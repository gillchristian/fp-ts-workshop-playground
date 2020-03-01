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

// ---

const name = 'Srgjan'
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

// Exercises

// 1. List of Catawiki employees (admins) with their emails (name's initial + last name + @catawiki.com)
// 2. Count the amount of lots
// 3. For user's profile pretty print name + date -> 'Charles Easton (pro seller), joined ...
//                                                -> 'Wanda Vang (catawiki employee), joined ...
// 4. Play around with pipe & flow
