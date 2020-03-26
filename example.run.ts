// import {keepEvenInRange} from './src/03.example.imperative'
// import {keepEvenInRange} from './src/03.example.option'
import {keepEvenInRange} from './src/03.example.either'

const cases = ['fo', '-1', '55', '50']

cases.forEach(str => {
  console.log(`"${str}" ->`, keepEvenInRange(str))
})
