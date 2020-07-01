import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import FriendRequestBox from "./FriendRequestBox";
import AddFriendBox from "./AddFriendBox";
import LoggedinNavbar from "./LoggedinNavbar";

const Title = styled.h1`
  text-align: center;
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 5px;
  width: 50%;
  margin: auto;
  box-shadow: 5px 10px 10px 10px;
  min-height: 80vh;
  margin-top: 60px;
`;

export default class FindFriendPage extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentDidMount() {
    let user = await axios.get("http://localhost:5000/user/id", {
      headers: { Authorization: localStorage.getItem("token") },
    });

    console.log(user);

    this.setState({ loading: false, id: user.data.id });
  }

  render() {
    if (!this.state.loading)
      return (
        <>
          <LoggedinNavbar />
          <PageContainer>
            {" "}
            <Title>Hello!! Ready to make new friends ?</Title>
            <FriendRequestBox user={this.state.id} />
            <AddFriendBox user={this.state.id} />
          </PageContainer>
        </>
      );
    else return <h1>Loading</h1>;
  }
}
