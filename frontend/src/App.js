import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";
import LoginFrom from "./components/LoginFrom";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import ResetPassword from "./components/ResetPassword";

const Wrapper = styled.section`
  margin: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
`;

const App = () => (
  <Router>
    <Navbar />
    <Wrapper>
      {" "}
      <Route exact path="/">
        <h1>Hello from Landing</h1>
      </Route>
      <Route exact path="/signin">
        <LoginFrom />{" "}
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/forgotpassword">
        <ForgotPassword />
      </Route>
      <Route exact path="/resetpassword/:token" component={ResetPassword} />
      <PrivateRoute component={Home} path="/home" exact />
    </Wrapper>
  </Router>
);

export default App;
