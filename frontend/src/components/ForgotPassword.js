import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
const ForgotForm = styled.form`
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

const Alert = styled.h1`
  background-color: #fff;
  color: red;
  font-size: 2rem;
`;

export default class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      emailSent: false,
      error: false,
      loading: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let email = e.target.email.value;
    axios
      .post("/user/forget", { email })
      .then((result) => {
        if (result.data.message === "mail sent")
          this.setState({ emailSent: true, loading: false });
        else this.setState({ error: true });
      })
      .catch((err) => {
        this.setState({ error: true });
      });
  };

  render() {
    if (this.state.loading) return <h1>Loading....</h1>;
    return (
      <ForgotForm onSubmit={this.handleSubmit}>
        {this.state.emailSent && <Alert>Email Sent</Alert>}
        {this.state.error && (
          <Alert>
            Error Occured, there might be a problem with the server or your
            email
          </Alert>
        )}
        <h1>Forgot Your Password ? Just Reset it </h1>
        <Label>Email</Label>
        <InputField type="text" placeholder="Enter Your Email" name="email" />
        <FormButton type="submit">Send Confirmation Link</FormButton>
      </ForgotForm>
    );
  }
}
