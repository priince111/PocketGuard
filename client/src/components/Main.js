import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import Home from "./Home";
const Main = () => {
  return (
    <div className="main">
      <BrowserRouter>
      <Switch>
        <Route path="/signin">
          <LoginModal />
        </Route>
        <Route path="/signup">
          <RegisterModal />
        </Route>
        <Route path="/home">
          <Home/>
        </Route>
        <Route path="/">
          <LoginModal/>
        </Route>
      </Switch>
      </BrowserRouter>
    </div>
  );
};

export default Main;
