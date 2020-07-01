import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import Request from "./Request";

const Title = styled.h2`
  text-align: center;
`;

const Card = styled.div`
  width: 80%;
  padding: 20px;
  margin: 20px auto;
`;

class FriendRequestBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      data: [],
      user: props.user,
    };
    console.log(this.state);
  }

  getRequests = async () => {
    let response = await axios.get(
      "http://localhost:5000/user/friend/friendrequests",
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
    console.log(response);

    this.setState({ data: response.data.requests });
  };

  onRequestStateChnage = (reqId) => {
    let requests = this.state.data.filter((request) => request._id != reqId);
    this.setState({ data: requests, key: this.state.key + 1 });
  };

  componentDidMount() {
    this.getRequests();
  }

  render() {
    if (this.state.data.length !== 0)
      return (
        <>
          <Title>Friend Requests</Title>
          <Card>
            {this.state.data.map((request, index) => (
              <Request
                request={request}
                action={this.onRequestStateChnage}
                key={`request${this.state.key}${index}`}
              />
            ))}
          </Card>
        </>
      );
    else return <Title>No Friend Request</Title>;
  }
}

export default FriendRequestBox;
