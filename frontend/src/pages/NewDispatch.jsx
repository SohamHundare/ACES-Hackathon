import { useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleCheck,
  Clock3,
  Info,
  Leaf,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
  Sprout,
  Truck,
  Volume2,
  Wallet,
  TrendingUp,
} from 'lucide-react'
import { MarketComparison } from '../components/MarketComparison.jsx'
import { useTranslation } from '../i18n/useTranslation.js'

const crops = [
  { name: 'tomatoes', group: 'standard', price: 36, spoilage: 8.4, transit: '12h', change: '+4.2%', image: 'photo-1546094096-0df4bcaaa337' },
  { name: 'onions', group: 'standard', price: 28, spoilage: 3.1, transit: '48h', change: '+3.1%', image: 'photo-1618512496248-a07fe83aa8cb' },
  { name: 'potatoes', group: 'standard', price: 25, spoilage: 1.3, transit: '36h', change: '-1.3%', image: 'photo-1518977676601-b53f82aba655', position: '78% center' },
  { name: 'capsicum', group: 'standard', price: 42, spoilage: 6.8, transit: '12h', change: '+6.8%', image: 'photo-1563565375-f3fdfdbefa83' },
  { name: 'spinach', group: 'leafy', price: 30, spoilage: 8.4, transit: '3h', change: '+4.1%', image: 'photo-1576045057995-568f588f82fb' },
  { name: 'coriander', group: 'leafy', price: 50, spoilage: 9.5, transit: '3h', change: '+5.8%', image: 'photo-1588879460618-9249e7d947d1' },
  { name: 'fenugreek', group: 'leafy', price: 34, spoilage: 8.2, transit: '3h', change: '+3.2%', image: 'photo-1588242386288-4e8456b44cc3', position: 'center' },
  { name: 'amaranth', group: 'leafy', price: 32, spoilage: 10, transit: '3h', change: '-2.0%', image: 'photo-1786725961483-40a1720f2a5a', position: '70% center' },
]

const vehicles = [
  { id: 'tempo', nameKey: 'dispatch.smallTempo', typeKey: 'dispatch.piaggioApe', rate: 10, icon: Truck },
  { id: 'pickup', nameKey: 'dispatch.pickup', typeKey: 'dispatch.pickupType', rate: 14, icon: Truck },
  { id: 'lcv', nameKey: 'dispatch.lcv', typeKey: 'dispatch.lcvType', rate: 22, icon: Truck },
]

function money(amount) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

function CropCard({ crop, selected, onSelect }) {
  const { t } = useTranslation()
  const name = t(`crop.${crop.name}`)

  return (
    <button className={`crop-card${selected ? ' is-selected' : ''}`} type="button" onClick={onSelect} aria-pressed={selected}>
      <span className="crop-image-wrap">
        <img src={`https://images.unsplash.com/${crop.image}?auto=format&fit=crop&w=500&q=80`} style={{ objectPosition: crop.position || 'center' }} alt={name} />
        <span className={`crop-change${crop.change.startsWith('-') ? ' is-down' : ''}`}>{crop.change}</span>
        {selected && <span className="crop-check"><Check size={12} /></span>}
      </span>
      <span className="crop-details"><strong>{name}</strong><span className="transit-pill"><Clock3 size={10} />{t('dispatch.maxTransit', { time: crop.transit.replace('h', ` ${t('unit.hours')}`) })}</span></span>
    </button>
  )
}

function CropPicker({ selectedCrop, onSelect }) {
  const { t } = useTranslation()
  const groups = [{ key: 'standard', label: 'dispatch.standardCrops' }, { key: 'leafy', label: 'dispatch.leafyGreens' }]
  return (
    <section className="dispatch-section crop-picker">
      <div className="dispatch-section-heading">
        <span className="step-number">01</span>
        <div><h2>{t('dispatch.chooseCrop')}</h2><p>{t('dispatch.chooseCropHelp')}</p></div>
        <span className="crop-count">{t('dispatch.cropCount', { count: 8 })}</span>
      </div>
      {groups.map((group) => (
        <div className="crop-group" key={group.key}>
          <h3><Sprout size={13} />{t(group.label)}</h3>
          <div className="crop-grid">
            {crops.filter((crop) => crop.group === group.key).map((crop) => (
              <CropCard key={crop.name} crop={crop} selected={selectedCrop.name === crop.name} onSelect={() => onSelect(crop)} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function HarvestVolume({ volume, onVolumeChange }) {
  const { t } = useTranslation()

  return (
    <section className="dispatch-section volume-section">
      <div className="dispatch-section-heading">
        <span className="step-number">02</span>
        <div><h2>{t('dispatch.harvestVolume')}</h2><p>{t('dispatch.volumeHelp')}</p></div>
        <label className="volume-input"><input aria-label={t('dispatch.volumeAria')} type="number" min="50" max="5000" step="50" value={volume} onChange={(event) => onVolumeChange(Math.min(5000, Math.max(50, Number(event.target.value))))} /><span>{t('unit.kg')}</span></label>
      </div>
      <input className="volume-slider" style={{ '--slider-progress': `${((volume - 50) / 4950) * 100}%` }} type="range" min="50" max="5000" step="50" value={volume} aria-label={t('dispatch.volumeAria')} onChange={(event) => onVolumeChange(Number(event.target.value))} />
      <div className="slider-labels"><span>50 {t('unit.kg')}</span><span>5,000 {t('unit.kg')}</span></div>
      <div className="volume-shortcuts">
        {[100, 500, 1000].map((step) => <button type="button" key={step} onClick={() => onVolumeChange(Math.min(5000, volume + step))}>+{step.toLocaleString('en-IN')} {t('unit.kg')}</button>)}
      </div>
    </section>
  )
}

function VehiclePicker({ vehicle, onSelect, isCalculating }) {
  const { t } = useTranslation()

  return (
    <section className="dispatch-section vehicle-section">
      <div className="dispatch-section-heading">
        <span className="step-number">03</span>
        <div><h2>{t('dispatch.chooseVehicle')}</h2><p>{t('dispatch.vehicleHelp')}</p></div>
        <span className="included-note">{t('dispatch.roundTripIncluded')}</span>
      </div>
      <div className="vehicle-grid">
        {vehicles.map(({ id, nameKey, typeKey, rate, icon: Icon }) => (
          <button type="button" className={`vehicle-option${vehicle.id === id ? ' is-selected' : ''}`} key={id} onClick={() => onSelect({ id, nameKey, typeKey, rate })} aria-pressed={vehicle.id === id}>
            <Icon size={21} /><strong>{t(nameKey)}</strong><span>{t(typeKey)}</span><b>₹{rate}<small>/{t('unit.km')}</small></b>{vehicle.id === id && <CircleCheck className="vehicle-check" size={13} />}
          </button>
        ))}
      </div>
      <button className="calculate-button" type="submit" disabled={isCalculating}><Sparkles size={15} />{isCalculating ? 'Calculating Routes...' : t('dispatch.calculate')}<ArrowRight size={16} /></button>
      <p className="calculation-note"><ShieldCheck size={12} />{t('dispatch.calculationNote')}</p>
    </section>
  )
}

function EstimateCard({ crop, volume, vehicle, apiResult }) {
  const { t } = useTranslation()
  const market = apiResult?.best_market
  const staticGross = crop.price * volume
  const staticLogistics = 114 * 2 * vehicle.rate
  const staticSpoilage = Math.ceil((staticGross * crop.spoilage / 100) / 10) * 10
  const { gross, logistics, spoilage, takeHome } = market
    ? {
        gross: market.gross_revenue,
        logistics: market.transport_cost,
        spoilage: market.perishability_loss,
        takeHome: market.net_profit,
      }
    : {
        gross: staticGross,
        logistics: staticLogistics,
        spoilage: staticSpoilage,
        takeHome: Math.max(0, staticGross - staticLogistics - staticSpoilage),
      }
  const mandiPrice = market?.mandi_price_per_kg ?? crop.price
  const spoilageRate = market
    ? gross > 0 ? (spoilage / gross) * 100 : 0
    : crop.spoilage
  const distance = market?.distance_km
  const duration = market?.duration_hours
  const displayDistance = distance === undefined
    ? `114 ${t('unit.km')}`
    : `${distance} ${t('unit.km')}`
  const displayDuration = duration === undefined
    ? apiResult
      ? '—'
      : `2 ${t('unit.hours')} 20 ${t('unit.minutes')}`
    : (() => {
        const hrs = Math.floor(duration)
        const mins = Math.round((duration - hrs) * 60)
        return hrs === 0 ? `${mins} mins` : `${hrs} hrs ${mins} mins`
      })()

  return (
    <article className="estimate-card">
      <div className="estimate-title"><span><BadgeCheck size={14} />{t('dispatch.optimalMarket')}</span><span className="best-choice"><CircleCheck size={11} />{t('dispatch.firstChoice')}</span></div>
      <h2>{market?.market_name || market?.name || t('market.vashi')}</h2>
      <p className="estimate-location"><MapPin size={12} />{market ? market.area || '' : t('dispatch.naviMumbai')}</p>
      <div className="net-estimate"><span>{t('dispatch.estimate')} <Info size={11} /></span><strong>{money(takeHome)}</strong><small><TrendingUp size={11} />{t('dispatch.mandiPrice', { price: Number(mandiPrice).toFixed(1) })}</small></div>
      <div className="journey-details"><span><Navigation size={14} /><b>{displayDistance}</b><small>{t('dispatch.distance')}</small></span><span><Clock3 size={14} /><b>{displayDuration}</b><small>{t('dispatch.driveTime')}</small></span></div>
      <div className="breakdown-title">{t('dispatch.breakdown')}</div>
      <div className="breakdown-row"><span><TrendingUp size={13} /><span>{t('dispatch.grossValue')}<small>{t('dispatch.volumePrice', { volume: volume.toLocaleString('en-IN'), price: Number(mandiPrice).toFixed(1) })}</small></span></span><strong>{money(gross)}</strong></div>
      <div className="breakdown-row"><span><Truck size={13} /><span>{t('dispatch.logistics')}<small>{t('dispatch.roundTrip')}</small></span></span><strong>− {money(logistics)}</strong></div>
      <div className="breakdown-row"><span><Leaf size={13} /><span>{t('dispatch.spoilageBuffer')}<small>{t('dispatch.qualityLoss', { rate: spoilageRate.toFixed(1) })}</small></span></span><strong>− {money(spoilage)}</strong></div>
      <div className="take-home"><span><Wallet size={14} />{t('dispatch.takeHome')}</span><strong>{money(takeHome)}</strong></div>
      <p className="estimate-footnote"><ShieldCheck size={11} />{t('dispatch.estimateNote')}</p>
    </article>
  )
}

function Advisory({ crop, speaking, onListen, locale, aiText }) {
  const { t } = useTranslation()

  return (
    <article className="advisory-card">
      <div className="advisory-title"><span><Sparkles size={17} /></span><div><strong>{t('dispatch.advisoryTitle')}</strong><small>{t('dispatch.advisoryLabel')}</small></div></div>
      <p>{aiText || t('dispatch.advisoryBody', { crop: t(`crop.${crop.name}`).toLowerCase(), price: crop.price })}</p>
      <button className="listen-button" type="button" onClick={onListen} aria-pressed={speaking}><Volume2 size={14} />{speaking ? t('dispatch.stop') : t('dispatch.listen', { language: t(`language.${locale}`) })}</button>
      <small className="advisory-disclaimer">{t('dispatch.advisoryDisclaimer')}</small>
    </article>
  )
}

export function NewDispatch() {
  const { t, locale } = useTranslation()
  const [selectedCrop, setSelectedCrop] = useState(crops[0])
  const [volume, setVolume] = useState(500)
  const [vehicle, setVehicle] = useState(vehicles[0])
  const [speaking, setSpeaking] = useState(false)
  const [apiData, setApiData] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState('')

  function handleListen() {
    if (!('speechSynthesis' in window)) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const message = new SpeechSynthesisUtterance(t('dispatch.speech', { crop: t(`crop.${selectedCrop.name}`).toLowerCase() }))
    message.lang = `${locale}-IN`
    message.onend = () => setSpeaking(false)
    message.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(message)
    setSpeaking(true)
  }

  function handleCalculate(event) {
    event.preventDefault()
    setSpeaking(false)
    window.speechSynthesis?.cancel()
    setError('')
    setApiData(null)
    setIsCalculating(true)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setIsCalculating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/optimize/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              crop: selectedCrop.name,
              quantity: volume,
            }),
          })

          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.detail || data.error || `Request failed (${response.status}).`)
          }

          const cachedDispatch = {
            selected_crop: selectedCrop,
            crop: selectedCrop.name,
            volume,
            best_market: data.best_market,
            all_markets: data.all_markets,
            ai_advisory: data.ai_advisory,
          }
          localStorage.setItem('cropscout_latest_dispatch', JSON.stringify(cachedDispatch))
          setApiData(data)
          window.dispatchEvent(new Event('cropscout_dispatch_updated'))
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : 'Could not calculate dispatch routes.')
        } finally {
          setIsCalculating(false)
        }
      },
      (locationError) => {
        setError(
          locationError.code === locationError.PERMISSION_DENIED
            ? 'Location permission was denied. Allow location access and try again.'
            : 'Unable to get your location. Please try again.',
        )
        setIsCalculating(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }

  return (
    <div className="dispatch-page">
      <div className="dispatch-page-heading">
        <div><p className="eyebrow">{t('dispatch.eyebrow')}</p><h1>{t('dispatch.title')}</h1><p className="heading-subtitle">{t('dispatch.subtitle')}</p></div>
        <span className="simulated-data"><ShieldCheck size={12} />{apiData ? 'Live market data' : t('dispatch.simulated')}</span>
      </div>
      <div className="dispatch-layout">
        <form className="dispatch-form" onSubmit={handleCalculate}>
          <CropPicker selectedCrop={selectedCrop} onSelect={setSelectedCrop} />
          <HarvestVolume volume={volume} onVolumeChange={setVolume} />
          <VehiclePicker vehicle={vehicle} onSelect={setVehicle} isCalculating={isCalculating} />
          {error && <p role="alert">{error}</p>}
        </form>
        <aside className="dispatch-results">
          <EstimateCard crop={selectedCrop} volume={volume} vehicle={vehicle} apiResult={apiData} />
          <Advisory crop={selectedCrop} speaking={speaking} onListen={handleListen} locale={locale} aiText={apiData?.ai_advisory} />
        </aside>
      </div>
      <MarketComparison markets={apiData?.all_markets} />
    </div>
  )
}