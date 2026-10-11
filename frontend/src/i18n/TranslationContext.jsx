import { TranslationContext } from './translationContext.js'
import { localeForLanguage, translate } from '../config/translations.js'

export function TranslationProvider({ language, children }) {
  const t = (key, values) => translate(language, key, values)

  return (
    <TranslationContext.Provider value={{ t, locale: localeForLanguage(language) }}>
      {children}
    </TranslationContext.Provider>
  )
}
