import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
const Box = styled.div`
  & {
    align-items: center;
    box-sizing: border-box;
    width: 80%;
    margin: 20px auto;
    border: 1px solid black;
    border-radius: 5px;
    box-shadow: 5px 5px 20px #333;
  }
  &:after {
    content: "";
    clear: both;
    display: block;
  }
`;

const Button = styled.button`
  padding: 5px;
  float: right;
  margin: 10px 10px;
  background-color: #333;
  color: wheat;
`;

export default class Request extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.request._id,
      name: props.request.name,
      key: 1,
      accept: false,
      reject: false,
    };
  }

  acceptRequest = async () => {
    let response = await axios.post(
      "http://localhost:5000/user/friend/accept",
      { acceptRequestOf: this.state.id },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    this.setState({ accept: true });
    this.props.action(this.state.id);
  };

  rejectRequest = async () => {
    let response = await axios.post(
      "http://localhost:5000/user/friend/reject",
      { rejectRequestOf: this.state.id },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    this.setState({ reject: true });
    this.props.action(this.state.id);
  };
  render() {
    return (
      <Box>
        <h3>{this.state.name}</h3>
        <Button onClick={this.acceptRequest}>
          {this.state.accept ? "Accepted" : "Accept"}
        </Button>
        <Button onClick={this.rejectRequest}>
          {this.state.reject ? "Ignored" : "Ignore"}
        </Button>
      </Box>
    );
  }
}
