import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import AddFriend from "./AddFriend";

const Title = styled.h2`
  text-align: center;
`;

const Card = styled.div`
  width: 80%;
  padding: 20px;
  margin: 20px auto;
`;

export default class AddFriendBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      data: [],
      user: props.user,
    };
  }

  getData = async () => {
    let response = await axios.get(
      "http://localhost:5000/user/friend/suggestions",
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );

    console.log(response);
    this.setState({ data: response.data.suggestions });
  };

  componentDidMount() {
    this.getData();
  }

  onRequestStateChnage = (reqId) => {
    let suggestions = this.state.data.filter(
      (sugesstion) => sugesstion._id !== reqId
    );
    this.setState({ data: suggestions, key: this.state.key + 1 });
  };

  render() {
    return (
      <>
        <Title>Friend Suggestions</Title>
        <Card>
          {this.state.data.map((suggestion, index) => (
            <AddFriend
              suggestion={suggestion}
              action={this.onRequestStateChnage}
              key={`suggestion${this.state.key}${index}`}
            />
          ))}
        </Card>
      </>
    );
  }
}
