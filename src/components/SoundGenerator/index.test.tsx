import React from 'react'
import {createNoteTable} from '.'

test('octaves are generated correctly', () => {
  let test = createNoteTable(1, 1)

  expect(test.length).toBe(1)
  expect(Object.keys(test[0]).length).toBe(12)
  expect(test[0]["C"]).toBeCloseTo(32.703195662574829 * Math.pow(2, 1))

  test = createNoteTable(0, 0)
  expect(test[0]["C"]).toBeCloseTo(32.703195662574829)

  test = createNoteTable(7, 7)
  expect(test[0]["C"]).toBeCloseTo(4186.009044809578154)
})
