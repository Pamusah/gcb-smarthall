
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import TellerOperationsPage from './pages/TellerOperations/TellerOperationsPage'
import SelfServicePage from './pages/SelfService/SelfServicePage'
import QueueDisplayPage from './pages/QueueDisplay/QueueDisplayPage'
import SmartLearnPage from './pages/SmartLearn/SmartLearnPage'

import { checkApiHealth } from './services/api'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const data = await checkApiHealth()
        setServerStatus(data.message)
        console.log('Backend response:', data)
      } catch {
        setServerStatus('Backend connection failed')
      }
    }

    testConnection()
  }, [])

  return (
    <>
      <div className="bg-gcb-charcoal px-4 py-2 text-center text-xs text-white">
        API Status: {serverStatus}
      </div>

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/self-service" replace />}
        />

        <Route
          path="/self-service"
          element={<SelfServicePage />}
        />

        <Route
          path="/queue-display"
          element={<QueueDisplayPage />}
        />

        <Route
  path="/teller"
  element={<TellerOperationsPage />}
/>

        <Route
          path="/smart-learn"
          element={<SmartLearnPage />}
        />
      </Routes>
    </>
  )
}

export default App
