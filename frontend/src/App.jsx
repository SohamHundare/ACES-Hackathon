import { useEffect, useState } from 'react'
import { AppLayout } from './components/AppLayout.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { MarketAnalytics } from './pages/MarketAnalytics.jsx'
import { NewDispatch } from './pages/NewDispatch.jsx'
import { Settings } from './pages/Settings.jsx'
import { FARM_LOCATIONS } from './config/preferences.js'
import { TranslationProvider } from './i18n/TranslationContext.jsx'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState(() => window.location.hash.slice(1) || 'dashboard')
  const [language, setLanguage] = useState(() => localStorage.getItem('cropscout-language') || 'English')
  const [farmLocationId, setFarmLocationId] = useState(() => localStorage.getItem('cropscout-farm-location') || 'pimpri')

  useEffect(() => {
    const updatePage = () => setCurrentPage(window.location.hash.slice(1) || 'dashboard')
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  useEffect(() => localStorage.setItem('cropscout-language', language), [language])
  useEffect(() => localStorage.setItem('cropscout-farm-location', farmLocationId), [farmLocationId])

  const page = ['new-dispatch', 'market-analytics', 'settings'].includes(currentPage) ? currentPage : 'dashboard'
  const farmLocation = FARM_LOCATIONS.find((location) => location.id === farmLocationId) || FARM_LOCATIONS[0]

  return (
    <TranslationProvider language={language}>
      <AppLayout currentPage={page} language={language} onLanguageChange={setLanguage} farmLocation={farmLocation}>
        {page === 'new-dispatch' ? <NewDispatch /> : page === 'market-analytics' ? <MarketAnalytics /> : page === 'settings' ? <Settings language={language} onLanguageChange={setLanguage} farmLocationId={farmLocation.id} onFarmLocationChange={setFarmLocationId} /> : <Dashboard />}
      </AppLayout>
    </TranslationProvider>
  )
}

export default App