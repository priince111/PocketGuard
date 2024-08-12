import React, { createContext, useReducer } from "react";
export const TransactionContext = createContext();

export const transactionReducer = (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTION":
      return {
        transactions: action.payload,
      };
    case "CREATE_TRANSACTION":
      return {
        transactions: [action.payload, ...state.transactions],
      };
    case "DELETE_TRANSACTION":
      console.log("action.payload",action.payload);
      return {
        transactions: state.transactions.filter(
          (t) => t._id !== action.payload
        ),
      };
    case "UPDATE_TRANSACTION":
      return {
        transactions: state.transactions.map((transaction) =>
          transaction._id === action.payload._id ? action.payload : transaction
        ),
      };
    default:
      return state;
  }
};

const TransactionContextProvider = (props) => {
  const [state, dispatch] = useReducer(transactionReducer, {
    transactions: [],
  });

  return (
    <TransactionContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionContextProvider;
