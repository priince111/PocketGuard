import "./App.css";
import Main from "../src/components/Main";
import UserContextProvider from "./contexts/UserContext";
import TransactionContextProvider from "./contexts/TransactionContext";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <TransactionContextProvider>
          <ToastContainer position="bottom-right" pauseOnHover = {false} autoClose = {600}/>
          <Main />
        </TransactionContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
