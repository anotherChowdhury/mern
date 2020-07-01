import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";
import LoginFrom from "./components/LoginFrom";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import { Home } from "./components/Home";
import ResetPassword from "./components/ResetPassword";
import FindFriendPage from "./components/FindFriendPage";
import LoggedinNavbar from "./components/LoggedinNavbar";

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
    <Route exact path="/">
      <Navbar />
      <Wrapper>
        {" "}
        <h1>Hello from Landing</h1>
      </Wrapper>
    </Route>
    <Route exact path="/signin">
      <Navbar />
      <Wrapper>
        <LoginFrom />{" "}
      </Wrapper>
    </Route>
    <Route exact path="/signup">
      <Navbar />
      <Wrapper>
        <Signup />
      </Wrapper>
    </Route>
    <Route exact path="/forgotpassword">
      <Wrapper>
        <ForgotPassword />
      </Wrapper>
    </Route>

    <Route exact path="/resetpassword/:token" component={ResetPassword} />

    <PrivateRoute component={Home} path="/home" exact />
    <PrivateRoute component={FindFriendPage} path="/findfriends" exact />
    <PrivateRoute component={LoggedinNavbar} path="/LoggedBar" exact />
  </Router>
);

export default App;
