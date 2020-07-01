import React, { Component } from "react";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import socketIOClient from "socket.io-client";
import styled from "styled-components";
import PostBox from "./PostBox";
import LoggedinNavbar from "./LoggedinNavbar";

// const Sidebar = styled.div`
//   /* box-sizing: border-box; */
//   width: 20%;
//   height: 50%;
//   border: 1px solid yellow;
//   /* margin-top: 60px; */
//   margin-left: 5%;
//   float: left;
// `;

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 50%;
  margin: 80px auto;
  /* border: 1px solid red; */
`;

const Title = styled.h1`
  text-align: center;
`;

var socket;
var socketId;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      user: "",
    };
  }

  getData = async () => {
    try {
      let response = await axios.get("/user/name", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      let data = response.data;
      // console.log(data);
      this.setState({ loading: false, name: data.name, user: data.id });
    } catch (err) {
      console.log(err);
      socket.emit("disconnect");
      localStorage.removeItem("token");
      this.setState({ redirect: true, loading: false });
    }
  };

  componentDidMount() {
    this.getData();
    socket = socketIOClient("http://localhost:5000");
    socket.on("id", (data) => {
      socketId = data;
    });
  }

  componentWillUnmount() {
    socket.close();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("disconnect", socketId);
    localStorage.removeItem("token");
    this.setState({ redirect: true });
  };

  showSelected = (e) => {
    this.setState({ selected: e.target.value.split("\\")[2] });
  };

  render() {
    if (this.state.loading) {
      return <h1>Loading.....</h1>;
    } else if (this.state.redirect) {
      return <Redirect to="/signin" />;
    } else {
      return (
        <>
          <LoggedinNavbar logout={this.handleSubmit} />
          <Wrapper>
            <PostBox user={this.state.user} />
          </Wrapper>
        </>
      );
    }
  }
}

export { Home, socket, socketId };
