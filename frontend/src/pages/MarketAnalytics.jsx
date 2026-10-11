import { useState } from 'react'
import { ChartNoAxesCombined, Info, ShieldCheck } from 'lucide-react'
import { MarketComparison } from '../components/MarketComparison.jsx'
import { useTranslation } from '../i18n/useTranslation.js'

const commodities = [
  { name: 'Tomatoes', prices: [23, 36, 30, 28], risks: [3.4, 8.4, 13, 17] },
  { name: 'Onions', prices: [26, 32, 29, 28], risks: [1.8, 3.1, 5.5, 7.2] },
  { name: 'Potatoes', prices: [21, 25, 24, 22], risks: [1.5, 2.8, 4.2, 6] },
  { name: 'Capsicum', prices: [30, 42, 35, 32], risks: [4.2, 7.5, 11, 14] },
  { name: 'Spinach', prices: [18, 30, 22, 20], risks: [9.5, 17, 25, 32] },
  { name: 'Coriander', prices: [34, 50, 39, 36], risks: [10, 18, 27, 34] },
  { name: 'Fenugreek', prices: [24, 34, 28, 26], risks: [8, 14, 21, 28] },
  { name: 'Amaranth', prices: [23, 32, 27, 25], risks: [9, 16, 24, 31] },
]

const marketRoutes = [
  { name: 'Pune APMC', area: 'Pune', distance: 18, eta: '35 mins' },
  { name: 'Vashi APMC', area: 'Navi Mumbai', distance: 114, eta: '2h 20m' },
  { name: 'Nashik APMC', area: 'Nashik', distance: 196, eta: '3h 45m' },
  { name: 'Solapur APMC', area: 'Solapur', distance: 252, eta: '4h 45m' },
]

function formatMoney(value) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}

function makeComparisonRows(commodity) {
  return marketRoutes.map((market, index) => {
    const price = commodity.prices[index]
    const risk = commodity.risks[index]
    const gross = price * 500
    const transport = market.distance * 20
    const spoilage = Math.ceil((gross * risk / 100) / 10) * 10
    const realization = gross - transport - spoilage

    return {
      name: market.name,
      area: market.area,
      distance: `${market.distance} km`,
      eta: market.eta,
      price: `₹${price}/kg`,
      risk: `${risk}%`,
      realization: formatMoney(realization),
      realizationValue: realization,
    }
  }).sort((first, second) => second.realizationValue - first.realizationValue)
    .map((market, index) => ({ ...market, recommendation: index === 0 ? 'Best Choice' : 'Profitable', best: index === 0 }))
}

function PriceComparison({ commodity }) {
  const { t } = useTranslation()
  const highestPrice = Math.max(...commodity.prices)

  return (
    <section className="price-chart-panel" aria-label={t('analytics.chartAria', { crop: t(`crop.${commodity.name.toLowerCase()}`) })}>
      <div className="price-chart-heading">
        <span className="price-chart-icon"><ChartNoAxesCombined size={17} /></span>
        <div><h2>{t('analytics.modalPrices', { crop: t(`crop.${commodity.name.toLowerCase()}`) })}</h2><p>{t('analytics.perKg')}</p></div>
      </div>
      <div className="price-bars">
        {marketRoutes.map((market, index) => (
          <div className="price-row" key={market.name}>
            <span className="price-market-name">{t(`market.${market.name.split(' ')[0].toLowerCase()}`)}</span>
            <div className="price-track" role="meter" aria-label={t('analytics.priceAria', { market: t(`market.${market.name.split(' ')[0].toLowerCase()}`), crop: t(`crop.${commodity.name.toLowerCase()}`) })} aria-valuemin="0" aria-valuemax={highestPrice} aria-valuenow={commodity.prices[index]}>
              <span style={{ width: `${(commodity.prices[index] / highestPrice) * 100}%` }} />
            </div>
            <strong className="price-value">₹{commodity.prices[index]}<small>/{t('unit.kg')}</small></strong>
          </div>
        ))}
      </div>
    </section>
  )
}

export function MarketAnalytics() {
  const { t } = useTranslation()
  const [selectedCommodity, setSelectedCommodity] = useState(commodities[0])
  const comparisonRows = makeComparisonRows(selectedCommodity)

  return (
    <div className="analytics-page">
      <div className="analytics-heading">
        <div><p className="eyebrow">{t('analytics.eyebrow')}</p><h1>{t('analytics.title')}</h1><p className="heading-subtitle">{t('analytics.subtitle')}</p></div>
        <span className="simulated-data"><ShieldCheck size={12} />{t('analytics.simulated')}</span>
      </div>
      <div className="commodity-tabs" role="tablist" aria-label={t('analytics.selectCommodity')}>
        {commodities.map((commodity) => (
          <button
            className={`commodity-tab${selectedCommodity.name === commodity.name ? ' is-active' : ''}`}
            type="button"
            role="tab"
            aria-label={t(`crop.${commodity.name.toLowerCase()}`)}
            aria-selected={selectedCommodity.name === commodity.name}
            key={commodity.name}
            onClick={() => setSelectedCommodity(commodity)}
          >
            {t(`crop.${commodity.name.toLowerCase()}`)}
          </button>
        ))}
      </div>
      <PriceComparison commodity={selectedCommodity} />
      <MarketComparison
        markets={comparisonRows}
        footerNote="comparison.simulated"
        footerRight={<><Info size={12} />{t('comparison.allInr')}</>}
      />
    </div>
  )
}