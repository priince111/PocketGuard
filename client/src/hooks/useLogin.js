import { useContext, useState } from 'react'
import { UserContext } from '../contexts/UserContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const [success, setSuccess] = useState(false)
  const { dispatch } = useContext(UserContext);

  const login = async (userdata) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false);
    console.log("userdata in login", userdata);
    const body = JSON.stringify({ userdata });
    console.log("body", body);
    const response = await fetch('/api/signin', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userdata })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      setSuccess(true);

      // update loading state
      setIsLoading(false)
      window.location.href = '/home'
    }
  }

  return { login, isLoading, error, success }
}