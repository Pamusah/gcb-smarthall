
const API_BASE_URL = 'http://localhost:5000/api'

export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)

    if (!response.ok) {
      throw new Error('Backend request failed')
    }

    return await response.json()
  } catch (error) {
    console.error('API connection error:', error.message)
    throw error
  }
}
