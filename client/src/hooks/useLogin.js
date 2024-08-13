import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import api from '../components/utils/api';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { dispatch } = useContext(UserContext);

  const login = async (userdata) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post('/api/signin', userdata, {
        headers: { 'Content-Type': 'application/json' }
      });
      const json = response.data;
      
      if (response.status !== 200) {
        setError(json.error);
        return;
      }
      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });
      setSuccess(true);
      window.location.href = '/home';
    } catch (err) {
      console.error("the error",err); 
      setError(err.response.data.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, success };
};
