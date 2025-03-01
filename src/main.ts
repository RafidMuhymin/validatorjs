import type Messages from './messages'
import type { Rule } from './rule'
import type { ValidatorOptions, VoidFunction, LangTypes, RuleType } from './types'
import { get, isArray } from 'lodash'
import AsyncResolvers from './async-resolvers'
import Errors from './errors'
import I18n from './i18n'
import { Manager } from './rule'
import { flattenObject, formatter, hasOwnProperty } from './utils'

export { Errors, ValidatorOptions, LangTypes, RuleType }

export default class Validator {
  readonly messages: Messages
  readonly errors: Errors
  public errorCount: number
  public hasAsync: boolean
  static lang: LangTypes = 'en'
  readonly numericRules = ['integer', 'numeric']
  public rules: Record<RuleType, any>
  stopOnAttributes: Record<string, any> | boolean | string[] | undefined
  static attributeFormatter = formatter
  readonly options!: ValidatorOptions
  static manager = new Manager()
  private readonly confirmedReverse?: boolean

  constructor(
    public readonly input: Record<string, any> | null,
    rules?: Record<RuleType, any>,
    options: Partial<ValidatorOptions> = {},
  ) {
    const lang = options.locale || Validator.getDefaultLang()
    Validator.useLang(lang)
    this.messages = I18n._make(lang)
    this.messages._setCustom(options.customMessages)
    this.setAttributeNames(options.customAttributes)
    this.setAttributeFormatter(Validator.attributeFormatter)
    this.errors = new Errors()
    this.errorCount = 0
    this.hasAsync = false
    this.rules = this._parseRules(rules)
    this.confirmedReverse = options.confirmedReverse
  }

  check() {
    for (let attribute in this.rules) {
      const attributeRules = this.rules[attribute]
      const inputValue = get(this.input, attribute)
      if (this._passesOptionalCheck(attribute)) continue

      for (let i = 0, len = attributeRules.length, rule: Rule, ruleOptions, rulePassed; i < len; i++) {
        ruleOptions = attributeRules[i]
        const { name, value } = ruleOptions
        rule = this.getRule(name)
        if (!this._isValidatable(rule, inputValue)) continue
        rulePassed = rule.validate(inputValue, value, attribute)
        if (!rulePassed) {
          if (name === 'confirmed' && this.confirmedReverse) {
            attribute = `${attribute}_confirmation`
            Object.assign(rule, { attribute })
          }
          this._addFailure(rule)
        }
        if (this._shouldStopValidating(attribute, rulePassed)) break
      }
    }

    return !this.errorCount
  }

  checkAsync(passes?: boolean | (() => void), fails?: any) {
    const emptyFn = () => {
      // empty code block
    }
    passes = passes || emptyFn
    fails = fails || emptyFn
    const failsOne = (rule: Rule, message = '') => {
      return this._addFailure(rule, message)
    }
    const resolvedAll = (allPassed: boolean) => {
      if (allPassed && typeof passes === 'function') {
        passes()
      } else {
        fails()
      }
    }
    const asyncResolvers = new AsyncResolvers(failsOne, resolvedAll)
    const validateRule = (
      inputValue: Record<string, any>,
      ruleOptions: Record<string, any>,
      attribute: string,
      rule: Record<string, any>,
    ) => {
      return () => {
        const resolverIndex = asyncResolvers.add(rule)
        rule.validate(inputValue, ruleOptions.value, attribute, () => asyncResolvers.resolve(resolverIndex))
      }
    }

    for (const attribute in this.rules) {
      const attributeRules = this.rules[attribute]
      const inputValue = get(this.input, attribute)
      if (this._passesOptionalCheck(attribute)) continue

      for (let i = 0, len = attributeRules.length, rule, ruleOptions; i < len; i++) {
        ruleOptions = attributeRules[i]
        rule = this.getRule(ruleOptions.name)
        if (this._isValidatable(rule, inputValue)) {
          validateRule(inputValue, ruleOptions, attribute, rule)()
        }
      }
    }

    asyncResolvers.enableFiring()
    asyncResolvers.fire()
  }

  _parseRules(rules: Record<RuleType, any> = {}) {
    const parsedRules: Record<RuleType, any> = {}
    rules = flattenObject(rules)
    for (const attribute in rules) {
      const rulesArray = rules[attribute]
      this._parseRulesCheck(attribute, rulesArray, parsedRules)
    }
    return parsedRules
  }

  static setMessages(lang: LangTypes, messages: Record<string, any>) {
    I18n._set(lang, messages)
    return this
  }

  static getMessages(lang: LangTypes) {
    return I18n._get(lang)
  }

  static useLang(lang: LangTypes) {
    Validator.lang = lang
  }

  static getDefaultLang() {
    return this.lang
  }

  static setAttributeFormatter(func: any) {
    this.attributeFormatter = func
  }

  getDefaultLang() {
    return Validator.lang
  }

  setAttributeFormatter(func: any) {
    this.messages._setAttributeFormatter(func)
  }

  _hasRule(attribute: string, findRules: string[]) {
    const rules = this.rules[attribute]
    for (const { name } of rules) {
      if (findRules.indexOf(name) > -1) return true
    }
    return false
  }

  _passesOptionalCheck(attribute: string) {
    const find = ['sometimes']
    return this._hasRule(attribute, find) && !this._suppliedWithData(attribute)
  }

  _suppliedWithData(attribute: string) {
    function hasNested(obj: undefined | Record<string, any>, key: string, ...args: string[]): boolean {
      if (obj === undefined) return false

      if (args.length == 0 && hasOwnProperty(obj, key)) return true

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return hasNested(obj[key], ...args)
    }

    const keys = attribute.split('.')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return hasNested(this.input, ...keys)
  }

  getRule(name: string): Rule {
    return Validator.manager.make(name, this)
  }

  _isValidatable(rule: Record<string, any>, value: any): boolean {
    if (isArray(value) || Validator.manager.isImplicit(rule.name)) return true

    return this.getRule('required').validate(value, {})
  }

  _addFailure(rule: Rule, message = '') {
    const msg = message || this.messages.render(rule)
    this.errors.add(rule.attribute, msg)
    this.errorCount++
  }

  _shouldStopValidating(attribute: string, rulePassed: any) {
    const stopOnAttributes = this.stopOnAttributes
    const isUndefined = typeof stopOnAttributes === 'undefined'
    if (isUndefined || stopOnAttributes === false || rulePassed === true) return false

    if (stopOnAttributes instanceof Array) {
      return stopOnAttributes.indexOf(attribute) > -1
    }

    return true
  }

  _parseRulesCheck(
    attribute: string,
    rulesArray: Record<string, any>[] | any[] | string,
    parsedRules: Record<string, any>,
    wildCardValues?: any[],
  ) {
    if (attribute.indexOf('*') > -1) {
      this._parsedRulesRecurse(attribute, rulesArray, parsedRules, wildCardValues)
    } else {
      this._parseRulesDefault(attribute, rulesArray, parsedRules, wildCardValues)
    }
  }

  _parsedRulesRecurse(
    attribute: string,
    rulesArray: Record<string, any>[] | any[] | string,
    parsedRules: Record<string, any>,
    wildCardValues: number[] = [],
  ) {
    const parentPath = attribute.substring(0, attribute.indexOf('*') - 1)
    const propertyValue = get(this.input, parentPath)

    if (propertyValue) {
      for (let propertyNumber = 0; propertyNumber < propertyValue.length; propertyNumber++) {
        const workingValues = wildCardValues.slice()
        workingValues.push(propertyNumber)
        this._parseRulesCheck(attribute.replace(/\*/g, String(propertyNumber)), rulesArray, parsedRules, workingValues)
      }
    }
  }

  _parseRulesDefault(
    attribute: string,
    rulesArray: Record<string, any>[] | any[] | string,
    parsedRules: Record<string, any> | any,
    wildCardValues?: any,
  ) {
    const attributeRules = []

    if (rulesArray instanceof Array) {
      rulesArray = this._prepareRulesArray(rulesArray)
    }

    if (typeof rulesArray === 'string') {
      rulesArray = rulesArray.split('|')
    }

    for (const ruleKey of rulesArray) {
      const rule = this._extractRuleAndRuleValue(ruleKey)
      if (rule.value) rule.value = this._replaceWildCards(rule.value, wildCardValues)
      this._replaceWildCardsMessages(wildCardValues)

      if (Validator.manager.isAsync(rule.name)) this.hasAsync = true
      attributeRules.push(rule)
    }

    parsedRules[attribute] = attributeRules
  }

  _prepareRulesArray(rulesArray: Record<string, any>[] | any[]) {
    const rules: Record<string, any>[] = []

    for (const ruleArray of rulesArray) {
      if (typeof ruleArray === 'object') {
        for (const rule in ruleArray) {
          rules.push({ name: rule, value: ruleArray[rule] })
        }
      } else {
        rules.push(ruleArray)
      }
    }

    return rules
  }

  _extractRuleAndRuleValue(ruleString: string | Record<string, any>) {
    if (typeof ruleString !== 'string') return ruleString
    const rule: Record<string, any> = {}
    let ruleArray

    rule.name = ruleString

    if (ruleString.indexOf(':') >= 0) {
      ruleArray = ruleString.split(':')
      rule.name = ruleArray[0]
      rule.value = ruleArray.slice(1).join(':')
    }

    return rule
  }

  _replaceWildCards(path: string, nums: string[]) {
    if (!nums) return path

    for (const num of nums) {
      const pos = path.indexOf('*')
      if (pos === -1) return path
      path = path.substring(0, pos) + num + path.substring(pos + 1)
    }
    return path
  }

  _replaceWildCardsMessages(nums: string[]) {
    const customMessages = this.messages.customMessages
    for (const key of Object.keys(customMessages)) {
      const newKey = this._replaceWildCards(key, nums)
      customMessages[newKey] = customMessages[key]
    }

    this.messages._setCustom(customMessages)
  }

  _hasNumericRule(attribute: string) {
    return this._hasRule(attribute, this.numericRules)
  }

  setAttributeNames(attributes: Record<string, any> = {}) {
    this.messages._setAttributeNames(attributes)
  }

  stopOnError(attributes: Record<string, any> | boolean) {
    this.stopOnAttributes = attributes
  }

  static stopOnError(attributes: Record<string, any> | boolean) {
    this.prototype.stopOnAttributes = attributes
  }

  passes(passes?: () => void) {
    const async = this._checkAsync('passes', passes)
    if (async) return this.checkAsync(passes)
    return this.check()
  }

  fails(fails?: VoidFunction) {
    const async = this._checkAsync('fails', fails)
    if (async) return this.checkAsync(false, fails)
    return !this.check()
  }

  _checkAsync(funcName: string, callback?: boolean | (() => void)) {
    const hasCallback = typeof callback === 'function'
    if (this.hasAsync && !hasCallback) {
      throw funcName + ' expects a callback when async rules are being tested.'
    }

    return this.hasAsync || hasCallback
  }

  validated(passes?: VoidFunction, fails?: VoidFunction) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    if (this._checkAsync('passes', passes)) {
      return this.checkAsync(
        function () {
          if (passes && typeof passes === 'function') {
            passes(_this._onlyInputWithRules())
          }
        }.bind(this),
        fails,
      )
    } else {
      if (this.check()) {
        return this._onlyInputWithRules()
      } else {
        throw new Error('Validation failed!')
      }
    }
  }

  _onlyInputWithRules(obj?: Record<string, any>, keyPrefix?: string) {
    const prefix = keyPrefix || ''
    const values: Record<string, any> = JSON.parse(JSON.stringify(obj === undefined ? this.input : obj))

    for (const key of Object.keys(values)) {
      if (values[key] !== null && typeof values[key] === 'object') {
        values[key] = this._onlyInputWithRules(values[key], prefix + key + '.')
      } else {
        if (values[key] === undefined || !Object.keys(this.rules).includes(prefix + key)) {
          delete values[key]
        }
      }
    }

    return values
  }

  static register(name: string, fn: any, message?: string) {
    const lang = Validator.getDefaultLang()
    this.manager.register(name, fn)
    I18n._setRuleMessage(lang, name, message)
  }

  static registerImplicit(name: string, fn: any, message?: string) {
    const lang = Validator.getDefaultLang()
    this.manager.registerImplicit(name, fn)
    I18n._setRuleMessage(lang, name, message)
  }

  static registerAsync(name: string, fn: any, message?: string) {
    const lang = Validator.getDefaultLang()
    this.manager.registerAsync(name, fn)
    I18n._setRuleMessage(lang, name, message)
  }

  static registerAsyncImplicit(name: string, fn: any, message?: string) {
    const lang = Validator.getDefaultLang()
    this.manager.registerAsyncImplicit(name, fn)
    I18n._setRuleMessage(lang, name, message)
  }

  static registerMissedRuleValidator(fn: any, message?: string) {
    this.manager.registerMissedRuleValidator(fn, message)
  }
}
