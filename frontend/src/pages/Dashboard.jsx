import { ArrowDown, ArrowRight, MapPin, Sprout, Wallet } from 'lucide-react'
import { MarketComparison } from '../components/MarketComparison.jsx'
import { useTranslation } from '../i18n/useTranslation.js'

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

const summaryCards = [
  { label: 'dashboard.harvest', value: '500', detail: 'dashboard.tomatoes', icon: Sprout },
  { label: 'dashboard.optimalMarket', value: 'Vashi APMC', detail: 'dashboard.fromFarm', icon: MapPin },
  { label: 'dashboard.netReturn', value: '₹14,200', detail: 'dashboard.afterCosts', icon: Wallet },
]

function SummaryCards() {
  const { t } = useTranslation()

  return (
    <section className="summary-grid" aria-label={t('dashboard.eyebrow')}>
      {summaryCards.map(({ label, value, detail, icon: Icon }) => (
        <article className="summary-card" key={label}>
          <Icon className="summary-icon" size={18} strokeWidth={1.7} />
          <p>{t(label)}</p>
          <strong>{label === 'dashboard.optimalMarket' ? t('market.vashi') : label === 'dashboard.harvest' ? `${value} ${t('unit.kg')}` : value}</strong>
          <small>{detail === 'dashboard.fromFarm' ? t(detail, { distance: `114 ${t('unit.km')}` }) : t(detail)}</small>
        </article>
      ))}
    </section>
  )
}

export function Dashboard() {
  const { t } = useTranslation()

  return (
    <div className="dashboard-page" id="dashboard">
      <PageHeading />
      <WelcomeBanner />
      <SummaryCards />
      <MarketComparison />
      <button className="download-button" type="button" aria-label={t('dashboard.downloadReport')}><ArrowDown size={15} /></button>
    </div>
  )
}