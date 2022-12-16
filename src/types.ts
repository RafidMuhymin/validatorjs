import type { Rule } from './rule'

export type LangTypes =
  | 'ar'
  | 'az'
  | 'be'
  | 'bg'
  | 'bs'
  | 'ca'
  | 'cs'
  | 'cy'
  | 'da'
  | 'de'
  | 'el'
  | 'en'
  | 'es'
  | 'et'
  | 'eu'
  | 'fa'
  | 'fi'
  | 'fr'
  | 'hr'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'ka'
  | 'km'
  | 'ko'
  | 'lt'
  | 'lv'
  | 'mk'
  | 'mn'
  | 'ms'
  | 'nb_NO'
  | 'nl'
  | 'pl'
  | 'pt'
  | 'pt_BR'
  | 'ro'
  | 'ru'
  | 'se'
  | 'sl'
  | 'sq'
  | 'sr'
  | 'sv'
  | 'tr'
  | 'ua'
  | 'uk'
  | 'uz'
  | 'vi'
  | 'zh'
  | 'zh_TW'

export interface Replacement {
  between: (template: string, rule: Rule) => string
  digits_between: (template: string, rule: Rule) => string
  required_if: (template: string, rule: Rule) => string
  required_unless: (template: string, rule: Rule) => string
  required_with: (template: string, rule: Rule) => string
  required_with_all: (template: string, rule: Rule) => string
  required_without: (template: string, rule: Rule) => string
  required_without_all: (template: string, rule: Rule) => string
  after: (template: string, rule: Rule) => string
  before: (template: string, rule: Rule) => string
  after_or_equal: (template: string, rule: Rule) => string
  before_or_equal: (template: string, rule: Rule) => string
  same: (template: string, rule: Rule) => string
}
export type RuleType =
  | 'accepted'
  | 'alpha'
  | 'alpha_dash'
  | 'alpha_num'
  | 'array'
  | 'boolean'
  | 'date'
  | 'email'
  | 'hex'
  | 'integer'
  | 'ipv4'
  | 'ipv6'
  | 'numeric'
  | 'password'
  | 'present'
  | 'required'
  | 'regex'
  | 'sometimes'
  | 'string'
  | 'url'
  | 'after'
  | 'after_or_equal'
  | 'required_if'
  | 'required_unless'
  | 'required_with'
  | 'required_with_all'
  | 'required_without'
  | 'required_without_all'
  | 'size'
  | 'min'
  | 'max'
  | 'between'
  | 'same'
  | 'different'
  | 'in'
  | 'not_in'
  | 'confirmed'
  | 'digits'
  | 'digits_between'
  | 'before'
  | 'before_or_equal'
  | 'ip'
  | string

export interface ValidatorOptions {
  locale?: LangTypes
  confirmedReverse?: boolean
  customMessages?: Record<string, any>
  customAttributes?: Record<string, any>
}
export type VoidFunction = boolean | ((...arg: any) => any)
