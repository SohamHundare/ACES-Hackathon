import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, MapPin, Sprout, Wallet } from 'lucide-react'
import { MarketComparison } from '../components/MarketComparison.jsx'
import { useTranslation } from '../i18n/useTranslation.js'

const DISPATCH_CACHE_KEY = 'cropscout_latest_dispatch'
const DISPATCH_UPDATED_EVENT = 'cropscout_dispatch_updated'

function readCachedDispatch() {
  try {
    const saved = localStorage.getItem(DISPATCH_CACHE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Unable to load the cached dispatch for the dashboard.', error)
    return null
  }
}

function PageHeading() {
  const { t } = useTranslation()

  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{t('dashboard.eyebrow')}</p>
        <h1>{t('dashboard.title')}</h1>
        <p className="heading-subtitle">{t('dashboard.subtitle')}</p>
      </div>
      <a className="primary-button" href="#new-dispatch">{t('dashboard.newDispatch')} <ArrowRight size={15} /></a>
    </div>
  )
}

function WelcomeBanner() {
  const { t } = useTranslation()

  return (
    <section className="welcome-banner" aria-label={t('dashboard.heroAria')}>
      <div className="banner-content">
        <p className="banner-kicker">{t('dashboard.heroEyebrow')}</p>
        <h2>{t('dashboard.heroLine1')}<br />{t('dashboard.heroLine2')}</h2>
        <a className="banner-button" href="#new-dispatch">{t('dashboard.planDispatch')} <ArrowRight size={14} /></a>
      </div>
    </section>
  )
}

function SummaryCards({ cachedData }) {
  const { t } = useTranslation()
  const bestMarket = cachedData?.best_market
  const cropName = cachedData?.selected_crop?.name || cachedData?.crop
  const translatedCrop = cropName ? t(`crop.${cropName.toLowerCase()}`) : ''
  const harvestCrop = translatedCrop && translatedCrop !== `crop.${cropName?.toLowerCase()}`
    ? translatedCrop
    : cropName
      ? `${cropName.charAt(0).toUpperCase()}${cropName.slice(1)}`
      : ''
  const summaryCards = cachedData
    ? [
        {
          label: 'dashboard.harvest',
          value: `${cachedData.volume} ${t('unit.kg')}`,
          detail: harvestCrop,
          icon: Sprout,
        },
        {
          label: 'dashboard.optimalMarket',
          value: bestMarket?.market_name || '—',
          detail: 'dashboard.fromFarm',
          distance: bestMarket?.distance_km,
          icon: MapPin,
        },
        {
          label: 'dashboard.netReturn',
          value: bestMarket?.net_profit === undefined
            ? '—'
            : `₹${Math.round(bestMarket.net_profit).toLocaleString('en-IN')}`,
          detail: 'dashboard.afterCosts',
          icon: Wallet,
        },
      ]
    : [
        { label: 'dashboard.harvest', value: '500', detail: 'dashboard.tomatoes', icon: Sprout },
        { label: 'dashboard.optimalMarket', value: 'Vashi APMC', detail: 'dashboard.fromFarm', distance: 114, icon: MapPin },
        { label: 'dashboard.netReturn', value: '₹14,200', detail: 'dashboard.afterCosts', icon: Wallet },
      ]

  return (
    <section className="summary-grid" aria-label={t('dashboard.eyebrow')}>
      {summaryCards.map(({ label, value, detail, distance, icon: Icon }) => (
        <article className="summary-card" key={label}>
          <Icon className="summary-icon" size={18} strokeWidth={1.7} />
          <p>{t(label)}</p>
          <strong>{cachedData ? value : label === 'dashboard.optimalMarket' ? t('market.vashi') : label === 'dashboard.harvest' ? `${value} ${t('unit.kg')}` : value}</strong>
          <small>
            {label === 'dashboard.harvest' && cachedData
              ? detail
              : detail === 'dashboard.fromFarm'
                ? t(detail, { distance: `${distance ?? 114} ${t('unit.km')}` })
                : t(detail)}
          </small>
        </article>
      ))}
    </section>
  )
}

export function Dashboard() {
  const { t } = useTranslation()
  const [cachedData, setCachedData] = useState(readCachedDispatch)

  useEffect(() => {
    const updateCachedDispatch = () => setCachedData(readCachedDispatch())
    window.addEventListener(DISPATCH_UPDATED_EVENT, updateCachedDispatch)
    return () => window.removeEventListener(DISPATCH_UPDATED_EVENT, updateCachedDispatch)
  }, [])

  return (
    <div className="dashboard-page" id="dashboard">
      <PageHeading />
      <WelcomeBanner />
      <SummaryCards cachedData={cachedData} />
      <MarketComparison markets={cachedData ? cachedData.all_markets ?? [] : undefined} />
      <button className="download-button" type="button" aria-label={t('dashboard.downloadReport')}><ArrowDown size={15} /></button>
    </div>
  )
}