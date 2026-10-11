import { createContext } from 'react'
import { translate } from '../config/translations.js'

export const TranslationContext = createContext({
  t: (key, values) => translate('English', key, values),
  locale: 'en',
})