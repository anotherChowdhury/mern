import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import styled from "styled-components";
import { socket, socketId } from "./Home";

const TheBar = styled.div`
  & {
    box-sizing: border-box;
    width: 100%;
    height: 7%;
    position: fixed;
    top: 0;
    left: 0;
    color: #fff;
    background-color: #3b5998;
    z-index: 1;
  }
  &:after {
    content: "";
    clear: both;
    display: block;
  }
`;

const Title = styled.h1`
  box-sizing: border-box;
  color: #fff;
  float: left;
  font-weight: bolder;
  margin: 5px 5%;
`;

const SearchField = styled.input`
  width: 40%;
  padding: 10px;
  margin: 5px 8%;
  border: none;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 8%;
  height: 100%;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  background: transparent;
  color: #fff;
  float: right;
  font-size: 1rem;
`;

class LoggedinNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  logout = () => {
    // socket.emit("disconnect", socketId);
    localStorage.removeItem("token");
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) return <Redirect to="/signin" />;

    return (
      <TheBar>
        <Link to="/home">
          <Title>Ajaira</Title>
        </Link>
        <SearchField placeholder="Looking for something?" />
        <Button onClick={this.logout}>Logout</Button>
        <Link to="/findfriends">
          <Button>Find Friends</Button>
        </Link>
        <Link to="/home">
          <Button>Home</Button>
        </Link>
      </TheBar>
    );
  }
}

export default LoggedinNavbar;
