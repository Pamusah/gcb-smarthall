import { Routes, Route, Navigate } from 'react-router-dom'

import SelfServicePage from './pages/SelfService/SelfServicePage'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/self-service" replace />}
      />

      <Route
        path="/self-service"
        element={<SelfServicePage />}
      />
    </Routes>
  )
}

export default App