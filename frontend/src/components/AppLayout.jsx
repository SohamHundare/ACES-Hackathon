import {
  ChartNoAxesCombined,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  Leaf,
  MapPin,
  Plus,
  Settings,
  Sprout,
} from 'lucide-react'
import { LANGUAGES } from '../config/preferences.js'
import { useTranslation } from '../i18n/useTranslation.js'

const navigation = [
  { key: 'nav.dashboard', href: '#dashboard', icon: LayoutDashboard, shortKey: 'nav.dashboard' },
  { key: 'nav.dispatch', href: '#new-dispatch', icon: Plus, shortKey: 'nav.dispatchShort' },
  { key: 'nav.analytics', href: '#market-analytics', icon: ChartNoAxesCombined, shortKey: 'nav.marketsShort' },
  { key: 'nav.settings', href: '#settings', icon: Settings, shortKey: 'nav.settings' },
]

function Brand() {
  const { t } = useTranslation()

  return (
    <a className="brand" href="#dashboard" aria-label="CropScout home">
      <span className="brand-mark"><Leaf size={21} strokeWidth={1.8} /><span>®</span></span>
      <span className="brand-copy">
        <strong>CropScout</strong>
        <small>{t('brand.tagline')}</small>
      </span>
    </a>
  )
}

function Sidebar({ currentPage, farmLocation }) {
  const { t } = useTranslation()

  return (
    <aside className="sidebar">
      <Brand />
      <div className="sidebar-label">{t('nav.workspaceLabel')}</div>
      <nav className="main-nav" aria-label={t('nav.workspaceLabel')}>
        {navigation.map(({ key, href, icon: Icon }) => {
          const active = href === `#${currentPage}`
          return (
          <a
            className={`nav-link${active ? ' is-active' : ''}`}
            href={href}
            aria-current={active ? 'page' : undefined}
            key={key}
          >
            <Icon size={16} strokeWidth={1.7} />
            <span>{t(key)}</span>
            {active && <i aria-hidden="true" />}
          </a>
          )
        })}
      </nav>

      <section className="sidebar-promo" aria-label={t('dashboard.heroAria')}>
        <div className="promo-copy">
          <Sprout size={17} />
          <strong>{t('nav.promoTitle')}</strong>
          <span>{t('nav.promoBody')}</span>
        </div>
      </section>
      <div className="farm-location">
        <span className="location-icon"><MapPin size={16} /></span>
        <span><strong>{t('location.region')}</strong><small>{t(`location.${farmLocation.id}`)}, {t(farmLocation.id === 'nashik' ? 'market.areaNashik' : 'location.pune')}</small></span>
        <button className="icon-button location-edit" type="button" aria-label={t('nav.changeLocation')}><Plus size={15} /></button>
      </div>
      <button className="sidebar-add" type="button" aria-label={t('nav.addWorkspace')}><Plus size={16} /><span>{t('nav.addWorkspace')}</span></button>
    </aside>
  )
}

function TopBar({ currentPage, language, onLanguageChange, farmLocation }) {
  const { t } = useTranslation()
  const pageTitle = t(currentPage === 'new-dispatch' ? 'nav.dispatch' : currentPage === 'market-analytics' ? 'nav.analytics' : currentPage === 'settings' ? 'nav.settings' : 'nav.dashboard')

  return (
    <header className="topbar">
      <div className="breadcrumbs"><span className="crumb-icon"><LayoutDashboard size={13} /></span><span>{t('nav.workspace')}</span><b>/</b><strong>{pageTitle}</strong></div>
      <div className="topbar-actions">
        <span className="top-location"><i />{t(`location.${farmLocation.id}`)}, {t(farmLocation.id === 'nashik' ? 'market.areaNashik' : 'location.pune')} <b>·</b> {t('nav.demo')}</span>
        <label className="language-select">
          <span className="sr-only">{t('nav.language')}</span>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value)} aria-label={t('nav.language')}>{LANGUAGES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
          <ChevronDown size={13} />
        </label>
        <button className="profile-button" type="button" aria-label={t('nav.profile')}><span>FS</span><CircleUserRound className="profile-mobile-icon" size={18} /></button>
      </div>
    </header>
  )
}

export function AppLayout({ children, currentPage, language, onLanguageChange, farmLocation }) {
  const { locale, t } = useTranslation()

  return (
    <div className="app-shell" lang={locale}>
      <Sidebar currentPage={currentPage} farmLocation={farmLocation} />
      <div className="workspace">
        <TopBar currentPage={currentPage} language={language} onLanguageChange={onLanguageChange} farmLocation={farmLocation} />
        <main className="page-content">{children}</main>
        <footer className="mobile-nav" aria-label={t('nav.workspaceLabel')}>
          {navigation.map(({ key, shortKey, href, icon: Icon }) => (
            <a className={href === `#${currentPage}` ? 'is-active' : ''} href={href} key={key} aria-label={t(key)}>
              <Icon size={18} /><span>{t(shortKey)}</span>
            </a>
          ))}
        </footer>
      </div>
    </div>
  )
}