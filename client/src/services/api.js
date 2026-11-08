
const API_BASE_URL = 'http://localhost:5000/api'

// Check backend connection
export async function checkApiHealth() {
  const response = await fetch(`${API_BASE_URL}/health`)

  if (!response.ok) {
    throw new Error('Backend request failed')
  }

  return await response.json()
}

// Register customer
export async function registerQueue(customerData) {
  const response = await fetch(`${API_BASE_URL}/queue/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customerData)
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Queue registration failed.')
  }

  return result
}

// Retrieve paginated queue
export async function getQueue(page = 1) {
  const response = await fetch(
    `${API_BASE_URL}/queue?page=${page}`
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to retrieve queue.')
  }

  return result
}


// Call the next customer assigned to a teller
export async function callNextCustomer(teller) {
  const response = await fetch(`${API_BASE_URL}/queue/call-next`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ teller })
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to call next customer.')
  }

  return result
}

// Complete the current customer's service
export async function completeService(ticketId) {
  const response = await fetch(
    `${API_BASE_URL}/queue/${ticketId}/complete`,
    {
      method: 'PATCH'
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to complete service.')
  }

  return result
}
