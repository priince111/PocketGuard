import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const useLogout = () => {
  const { dispatch } = useContext(UserContext);

  const logout = async () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    window.location.href = "/signin";
  };

  return { logout };
};
