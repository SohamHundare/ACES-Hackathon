import { useContext } from 'react'
import { TranslationContext } from './translationContext.js'

export function useTranslation() {
  return useContext(TranslationContext)
}