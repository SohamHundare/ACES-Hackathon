import { useEffect, useState } from 'react'
import { AppLayout } from './components/AppLayout.jsx'
import { FARM_LOCATIONS } from './config/preferences.js'
import { TranslationProvider } from './i18n/TranslationContext.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { MarketAnalytics } from './pages/MarketAnalytics.jsx'
import { NewDispatch } from './pages/NewDispatch.jsx'
import { Settings } from './pages/Settings.jsx'
import './App.css'

const availablePages = ['dashboard', 'dispatch', 'market-analytics', 'settings']

function App() {
  const [currentPage, setCurrentPage] = useState('dispatch')
  const [language, setLanguage] = useState(
    () => localStorage.getItem('cropscout-language') || 'English',
  )
  const [farmLocationId, setFarmLocationId] = useState(
    () => localStorage.getItem('cropscout-farm-location') || 'pimpri',
  )

  useEffect(() => {
    function updatePageFromHash() {
      const hashPage = window.location.hash.slice(1)
      const page = hashPage === 'new-dispatch' ? 'dispatch' : hashPage
      setCurrentPage(availablePages.includes(page) ? page : 'dispatch')
    }

    window.addEventListener('hashchange', updatePageFromHash)
    return () => window.removeEventListener('hashchange', updatePageFromHash)
  }, [])

  useEffect(() => {
    localStorage.setItem('cropscout-language', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('cropscout-farm-location', farmLocationId)
  }, [farmLocationId])

  const farmLocation =
    FARM_LOCATIONS.find((location) => location.id === farmLocationId) ||
    FARM_LOCATIONS[0]
  const layoutPage = currentPage === 'dispatch' ? 'new-dispatch' : currentPage

  let pageContent
  if (currentPage === 'dispatch') {
    pageContent = <NewDispatch />
  } else if (currentPage === 'market-analytics') {
    pageContent = <MarketAnalytics />
  } else if (currentPage === 'settings') {
    pageContent = (
      <Settings
        language={language}
        onLanguageChange={setLanguage}
        farmLocationId={farmLocation.id}
        onFarmLocationChange={setFarmLocationId}
      />
    )
  } else {
    pageContent = <Dashboard />
  }

  return (
    <TranslationProvider language={language}>
      <AppLayout
        currentPage={layoutPage}
        language={language}
        onLanguageChange={setLanguage}
        farmLocation={farmLocation}
      >
        {pageContent}
      </AppLayout>
    </TranslationProvider>
  )
}

export default App
