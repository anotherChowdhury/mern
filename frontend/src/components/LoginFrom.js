import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const LoginForm = styled.form`
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

const Label = styled.label`
  display: block;
  font-size: 2rem;
  text-align: center;
`;

const LinkStyled = styled(Link)`
  font-size: 1.4rem;
`;

const Warning = styled.p`
  color: red;
  margin: 20px auto;
  font-size: 1.4rem;
  background-color: #333;
`;

export default class LoginFrom extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      error: false,
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let email = e.target.email.value;
    let password = e.target.password.value;

    console.log({
      email,
      password,
    });

    axios
      .post(
        "/user/signin",
        { email, password }
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // }
      )
      .then((result) => {
        window.localStorage.setItem("token", result.data.token);
        console.log(localStorage.getItem("token"));
        this.setState({ redirect: true });
      })
      .catch((err) => {
        this.setState({ error: true, loading: false });
      });
  };

  render() {
    if (this.state.redirect) return <Redirect to="/home" />;
    else if (this.state.loading) return <h1>Loading...</h1>;
    else {
      return (
        <LoginForm onSubmit={this.onSubmit}>
          {this.state.error && <Warning>Wrong Email/Password</Warning>}
          <Label>Email</Label>
          <InputField type="text" placeholder="Email" name="email" />
          <Label>Password</Label>
          <InputField type="password" placeholder="Password" name="password" />
          <FormButton type="submit">Signin</FormButton>
          <LinkStyled to="/forgotpassword">Forgot Password</LinkStyled>
        </LoginForm>
      );
    }
  }
}
