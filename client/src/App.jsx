
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import SelfServicePage from './pages/SelfService/SelfServicePage'
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
        <Route path="/" element={<Navigate to="/self-service" replace />} />
        <Route path="/self-service" element={<SelfServicePage />} />
      </Routes>
    </>
  )
}

export default App
