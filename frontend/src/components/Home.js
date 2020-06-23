import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  getData = async () => {
    let response = await axios
      .get("/user/name", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        this.setState({ redirect: true });
      });

    console.log(response);
    let name = response.data.message;
    this.setState({ loading: false, name: name });
  };

  componentDidMount() {
    this.getData();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.loading) {
      return <h1>Loading.....</h1>;
    } else if (this.state.redirect) {
      return <Redirect to="/signin" />;
    } else {
      return (
        <>
          <h1>Hello {this.state.name}!!!</h1>
          <button onClick={this.handleSubmit}>Logout</button>
        </>
      );
    }
  }
}

export default Home;
