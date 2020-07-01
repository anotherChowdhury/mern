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

export default class AddFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.suggestion._id,
      name: props.suggestion.name,
      key: 1,
      send: false,
      notInterested: false,
    };
    console.log(this.state);
  }

  sendRequest = async (e) => {
    let response = await axios.post(
      "http://localhost:5000/user/friend/add",
      { sendRequestTo: this.state.id },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    console.log(response);

    this.setState({ send: true });
    this.props.action(this.state.id);
  };

  rejectRequest = (e) => {
    this.setState({ notInterested: true });
    this.props.action(this.state.id);
  };
  render() {
    return (
      <Box>
        <h3>{this.state.name}</h3>
        <Button onClick={this.sendRequest}>
          {this.state.send ? "Sent" : "Send Request"}
        </Button>
        <Button onClick={this.rejectRequest}>
          {this.state.notInterested ? "Ignored" : "Ignore"}
        </Button>
      </Box>
    );
  }
}
