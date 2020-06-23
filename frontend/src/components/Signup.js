import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const SignUpForm = styled.form`
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

const Warning = styled.p`
  color: red;
  margin: 20px auto;
  font-size: 1.4rem;
  background-color: #333;
`;

export default class Signup extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      loading: false,
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let name = e.target.name.value;
    let email = e.target.email.value;
    let password = e.target.password.value;

    axios
      .post(
        "/user/signup",
        { name, email, password }
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // }
      )
      .then((result) => {
        this.setState({ redirect: true, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err.response.data.message, loading: false });
      });
  };

  render() {
    if (this.state.redirect) return <Redirect to="/signin" />;
    else if (this.state.loading) return <h1>Loading.....</h1>;
    else {
      return (
        <SignUpForm onSubmit={this.onSubmit}>
          {this.state.error && <Warning>{this.state.error}</Warning>}
          <Label>Name</Label>
          <InputField type="text" placeholder="Name" name="name" required />
          <Label>Email</Label>
          <InputField type="text" placeholder="Email" name="email" required />
          <Label>Password</Label>
          <InputField
            type="password"
            placeholder="Password"
            name="password"
            required
          />
          <FormButton type="submit">Singup</FormButton>
        </SignUpForm>
      );
    }
  }
}
