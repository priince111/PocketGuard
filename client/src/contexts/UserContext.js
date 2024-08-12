import React, { createContext, useReducer, useEffect } from "react";
export const UserContext = createContext();

export const userReducer = (state, action) => {
  console.log("switch",action.payload)
    switch (action.type) {
      case 'LOGIN':
        return { user: action.payload }
      case 'LOGOUT':
        return { user: null }
      case 'SET_LOADING':
        return { ...state, loading: action.payload }
      default:
        return state
    }
  }

const UserContextProvider = (props) => {
  const [state, dispatch] = useReducer(userReducer, {
    user: null,
    loading: true,
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);
  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
