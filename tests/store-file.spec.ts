import { assert } from 'chai'
import { to_unix } from '@src/middlewares/store-file'

suite('Convert date to unix timestamp', () => {
  const date = new Date();
  [date, date.getTime(), date.getTime().toString()]
    .forEach((unit) => {
      test(`${typeof unit} ${unit} to unix`, () => {
        const result = to_unix(unit)
        assert.typeOf(result, 'number')
        assert.equal(result, date.getTime())
      })
    })
})
