import "./App.css";
import Main from "../src/components/Main";
import UserContextProvider from "./contexts/UserContext";
import TransactionContextProvider from "./contexts/TransactionContext";
function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <TransactionContextProvider>
          <Main />
        </TransactionContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
