import { useState } from "react";
import api from "../components/utils/api";
export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(false);

  const signup = async (userdata, otp) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await api.post(
        "/api/signup",
        { userdata, otp },
        { headers: { "Content-Type": "application/json" } }
      );

      const json = response.data;

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      }
      setIsLoading(false);
      setSuccess(true);
      window.location.href = "/signin";
    } catch (err) {
      console.log(err);
      setError(err.json.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error, success };
};
