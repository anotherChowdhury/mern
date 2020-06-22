import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const ResetForm = styled.form`
  width: 400px;
  height: auto;
  /* border: 1px solid red; */
  /* margin: auto; */
  /* background-color: #333; */
  /* box-sizing: border-box; */
`;

const InputField = styled.input`
  width: 100%;
  margin: 0 auto 20px auto;
  padding: 20px;
  box-sizing: border-box;
  font-size: 1.6rem;
  border: none;
`;

const FormButton = styled.button`
  width: 100%;
  margin: 0 auto 20px auto;
  padding: 20px;
  box-sizing: border-box;
  font-size: 1.6rem;
  background-color: #333;
  color: wheat;
`;

const Alert = styled.p`
  background-color: #fff;
  color: red;
`;
class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      updated: false,
      error: false,
      allowed: false,
      match: true,
    };
  }

  checkPassword = (e) => {
    let confirm = e.target.value;
    let password = document.querySelector("#password").value;
    if (password !== confirm) {
      this.setState({ match: false });
    } else {
      this.setState({ match: true });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let password = e.target.password.value;
    console.log(password);

    axios
      .post(
        "http://localhost:5000/updatepassword",
        { password },
        {
          headers: {
            Authorization: this.state.token,
          },
        }
      )
      .then((result) => {
        console.log(result.data);
        this.setState({ updated: true });
      });
  };

  componentDidMount() {
    let token = this.props.match.params.token;
    axios
      .get(`http://localhost:5000/resetpassword`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        console.log(result.data);
        this.setState({
          loading: false,
          allowed: true,
          token: result.data.token,
        });
      })
      .catch((err) => {
        this.setState({ loading: false, error: true });
      });
  }

  render() {
    if (this.state.loading) return <h1>Loading....</h1>;
    else if (this.state.updated)
      return <h1>Password Reset Successful, Please Login</h1>;
    else if (this.state.error)
      return (
        <h1>
          This Link has Expired , Please Request for reset password link{" "}
          <Link to="/forgotpassword">again</Link>
        </h1>
      );
    else {
      return (
        <ResetForm onSubmit={this.handleSubmit}>
          <InputField
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <InputField
            type="password"
            name="cfpassword"
            placeholder="Confirm Password"
            onChange={this.checkPassword}
            required
          />
          {!this.state.match && <Alert>Password doesn't match</Alert>}
          <FormButton>Update Password</FormButton>
        </ResetForm>
      );
    }
  }
}

export default ResetPassword;
