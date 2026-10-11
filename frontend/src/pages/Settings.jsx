import { useId } from 'react'
import { Globe2, MapPin, ShieldCheck } from 'lucide-react'
import { FARM_LOCATIONS, LANGUAGES } from '../config/preferences.js'
import { useTranslation } from '../i18n/useTranslation.js'

function PreferenceRow({ icon: Icon, title, description, children }) {
  return (
    <section className="preference-row">
      <span className="preference-icon"><Icon size={19} strokeWidth={1.8} /></span>
      <div className="preference-copy"><h2>{title}</h2><p>{description}</p></div>
      {children && <div className="preference-control">{children}</div>}
    </section>
  )
}

function SettingsPanel({ language, onLanguageChange, farmLocationId, onFarmLocationChange }) {
  const { t } = useTranslation()
  const languageId = useId()
  const locationId = useId()
  const selectedLocation = FARM_LOCATIONS.find((location) => location.id === farmLocationId) || FARM_LOCATIONS[0]

  return (
    <div className="settings-panel">
      <PreferenceRow icon={Globe2} title={t('settings.language')} description={t('settings.languageHelp')}>
        <label className="settings-select-wrap" htmlFor={languageId}>
          <span className="sr-only">{t('settings.languageSelect')}</span>
          <select id={languageId} value={language} onChange={(event) => onLanguageChange(event.target.value)}>
            {LANGUAGES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </PreferenceRow>
      <PreferenceRow icon={MapPin} title={t('settings.farmLocation')} description={`${t(`location.${selectedLocation.id}`)}, ${t(selectedLocation.id === 'nashik' ? 'market.areaNashik' : 'location.pune')}, ${t('location.maharashtra')}`}>
        <label className="settings-select-wrap location-select-wrap" htmlFor={locationId}>
          <span className="sr-only">{t('settings.locationSelect')}</span>
          <select id={locationId} value={farmLocationId} onChange={(event) => onFarmLocationChange(event.target.value)}>
            {FARM_LOCATIONS.map((location) => <option key={location.id} value={location.id}>{t(`location.${location.id}`)}</option>)}
          </select>
        </label>
      </PreferenceRow>
      <PreferenceRow icon={ShieldCheck} title={t('settings.marketData')} description={t('settings.marketDataHelp')}>
        <span className="data-status"><i />{t('settings.demoData')}</span>
      </PreferenceRow>
    </div>
  )
}

export function Settings({ language, onLanguageChange, farmLocationId, onFarmLocationChange }) {
  const { t } = useTranslation()

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <p className="eyebrow">{t('settings.eyebrow')}</p>
        <h1>{t('settings.title')}</h1>
        <p className="heading-subtitle">{t('settings.subtitle')}</p>
      </div>
      <div className="settings-content">
        <SettingsPanel
          language={language}
          onLanguageChange={onLanguageChange}
          farmLocationId={farmLocationId}
          onFarmLocationChange={onFarmLocationChange}
        />
        <p className="settings-note">{t('settings.note')}</p>
      </div>
      <footer className="settings-footer"><span>{t('settings.footer')}</span><span>Crop Scout <i /> {t('location.region')}</span></footer>
    </div>
  )
}