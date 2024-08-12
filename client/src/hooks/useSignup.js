import { useState } from 'react'
export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(false);

  const signup = async (userdata,otp) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({userdata,otp })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      setIsLoading(false)
      setSuccess(true)
      window.location.href = '/signin';
    }
  }

  return { signup, isLoading, error, success }
}