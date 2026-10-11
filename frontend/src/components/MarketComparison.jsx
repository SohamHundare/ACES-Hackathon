import { ArrowDown, ArrowRight, Check, CircleCheck, MapPin } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation.js'

const defaultMarkets = [
  { name: 'Vashi APMC', area: 'Navi Mumbai', distance: '114 km', eta: '2h 20m', price: '₹36/kg', risk: '8.4%', realization: '₹14,200', recommendation: 'Best Choice', best: true },
  { name: 'Pune APMC', area: 'Pune', distance: '18 km', eta: '35 mins', price: '₹23/kg', risk: '3.4%', realization: '₹10,750', recommendation: 'Profitable' },
  { name: 'Nashik APMC', area: 'Nashik', distance: '208 km', eta: '4h 10m', price: '₹31/kg', risk: '6.2%', realization: '₹12,380', recommendation: 'Good demand' },
  { name: 'Ahmednagar APMC', area: 'Ahilyanagar', distance: '121 km', eta: '2h 45m', price: '₹27/kg', risk: '4.8%', realization: '₹11,460', recommendation: 'Profitable' },
]

const marketKeys = {
  'Vashi APMC': 'market.vashi', 'Pune APMC': 'market.pune', 'Nashik APMC': 'market.nashik',
  'Ahmednagar APMC': 'market.ahmednagar', 'Solapur APMC': 'market.solapur',
  'Navi Mumbai': 'market.naviMumbai', Pune: 'market.areaPune', Nashik: 'market.areaNashik',
  Ahilyanagar: 'market.areaAhilyanagar', Solapur: 'market.areaSolapur',
}

function localizeDistance(value, t) {
  return typeof value === 'number'
    ? `${value} ${t('unit.km')}`
    : value.replace(/\bkm\b/g, t('unit.km'))
}

function localizeEta(value, t) {
  if (typeof value === 'number') {
    const hours = Math.floor(value)
    const minutes = Math.round((value - hours) * 60)
    return `${hours} ${t('unit.hours')} ${minutes} ${t('unit.minutes')}`
  }
  const hourDuration = value.match(/^(\d+)h\s*(\d+)m$/)
  if (hourDuration) return `${hourDuration[1]} ${t('unit.hours')} ${hourDuration[2]} ${t('unit.minutes')}`
  const minuteDuration = value.match(/^(\d+)\s*mins$/)
  if (minuteDuration) return `${minuteDuration[1]} ${t('unit.minutes')}`
  return value
}

function MarketTable({ markets }) {
  const { t } = useTranslation()

  return (
    <div className="market-table-wrap">
      <table className="market-table">
        <thead>
          <tr>
            <th>{t('comparison.market')}</th><th>{t('comparison.distance')}</th><th>{t('comparison.eta')}</th><th>{t('comparison.price')}</th><th>{t('comparison.risk')}</th>
            <th>{t('comparison.realization')} <ArrowDown size={12} /></th><th>{t('comparison.recommendation')}</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((market) => (
            <tr className={market.best ? 'best-market' : ''} key={market.market_name || market.name}>
              <td><div className="market-name"><span className={market.best ? 'market-pin is-best' : 'market-pin'}><MapPin size={14} /></span><span><strong>{marketKeys[market.market_name || market.name] ? t(marketKeys[market.market_name || market.name]) : market.market_name || market.name}</strong><small>{marketKeys[market.area] ? t(marketKeys[market.area]) : market.area || ''}</small></span></div></td>
              <td>{localizeDistance(market.distance_km ?? market.distance, t)}</td><td>{localizeEta(market.duration_hours ?? market.eta, t)}</td><td><strong>{market.price ? market.price.replace('/kg', `/${t('unit.kg')}`) : market.mandi_price_per_kg !== undefined ? `₹${Number(market.mandi_price_per_kg).toFixed(1)}/${t('unit.kg')}` : '—'}</strong></td>
              <td><span className="risk-value"><i />{market.risk}</span></td>
              <td className={market.best ? 'return-value' : ''}>{market.net_profit === undefined ? market.realization : `₹${Math.round(market.net_profit).toLocaleString('en-IN')}`}</td>
              <td><span className={market.best ? 'recommendation is-best' : 'recommendation'}>{market.best && <CircleCheck size={12} />}{t(market.recommendation === 'Best Choice' ? 'comparison.best' : market.recommendation === 'Good demand' ? 'comparison.goodDemand' : 'comparison.profitable')}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function MarketComparison({ markets, footerNote = 'comparison.footer', footerRight }) {
  const { t } = useTranslation()
  const displayedMarkets = markets === undefined ? defaultMarkets : markets

  return (
    <section className="market-section">
      <div className="section-heading">
        <div><h2>{t('comparison.title')}</h2><p>{t('comparison.subtitle')}</p></div>
        <span className="candidate-count"><MapPin size={13} />{t('comparison.candidates')}</span>
      </div>
      <MarketTable markets={displayedMarkets} />
      <div className="table-footer"><span><Check size={13} />{t(footerNote)}</span>{footerRight ? <span className="table-footer-right">{footerRight}</span> : <a href="#market-analytics">{t('comparison.viewAll')} <ArrowRight size={13} /></a>}</div>
    </section>
  )
}