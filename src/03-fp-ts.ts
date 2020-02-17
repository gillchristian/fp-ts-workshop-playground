import {pipe} from 'fp-ts/lib/pipeable'
import {flow, identity, not, constant} from 'fp-ts/lib/function'
import {of, concat, head, map} from 'fp-ts/lib/NonEmptyArray'

const toUpper = (str: string) => str.toUpperCase()
const exclaim = (str: string) => `${str}!`

const name = 'Srgjan'
const others = ['Jane', 'Charles', 'Angelica']

// ---

const isExclamation = (str: string) => /!$/.test(str)
