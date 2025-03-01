import Validator from '../src/main'

describe('after rule', () => {
  it('should fail when the comparing attribute are greater', () => {
    const validator = new Validator({ date: '1996-12-09', date2: '1995-08-09' }, { date2: 'after:date' })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual('The date2 must be after date.')
  })

  it('should fail when the comparing attribute are equal', () => {
    const validator = new Validator({ date: '1995-08-09', date2: '1995-08-09' }, { date2: 'after:date' })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual('The date2 must be after date.')
  })

  it('should pass when the comparing attribute are smaller', () => {
    const validator = new Validator({ date: '1995-08-09', date2: '1996-12-09' }, { date2: 'after:date' })

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail when date is invalid', () => {
    const validator = new Validator({ date: 'invalid-date', date2: '1996-12-09' }, { date2: 'after:date' })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })
})
