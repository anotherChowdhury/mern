import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import Post from "./Post";

const Container = styled.div`
  width: 80%;
  margin: 60px auto;
  /* border: 1px solid black; */
  box-sizing: border-box;
`;

const PostBoxContainer = styled.div`
  border: 1px solid black;
  z-index: 2;
`;

const PostTextArea = styled.textarea`
  width: 100%;
  display: block;
  box-sizing: border-box;
  resize: none;
  height: 5rem;
  position: relative;
`;

const Footer = styled.div`
  & {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    background-color: #3b5998;
  }
`;
const FooterButton = styled.button`
  & {
    box-sizing: border-box;
    background-color: transparent;
    color: #fff;
    padding: 5px;
    margin: "0 0 20px 20px";
    border: none;
    font-size: 1rem;
  }
  &:hover {
    background-color: #323;
  }
`;

const Label = styled.label`
  & {
    background-color: transparent;
    color: #fff;
    padding: 5px;
    margin: "0 20px 20px 0";
    font-size: 1rem;
    font-weight: bold;
  }
  &:hover {
    background-color: #323;
  }
`;

const ClosePreview = styled.button`
  margin: none;
  border: none;
  position: absolute;
`;

class PostBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      image: "",
      alert: false,
      data: [],
      key: 0,
      user: props.user,
    };
    this.delete = this.delete.bind(this);
  }

  delete(postId) {
    console.log(this.state.data);
    let new_posts = this.state.data.filter((post) => post._id !== postId);
    console.log(new_posts);

    this.setState({ data: new_posts, key: this.state.key + 1 });
  }

  componentDidMount() {
    axios
      .get("post/home", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((posts) => {
        this.setState({ data: posts.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.text === "" && this.state.image === "") {
      this.setState({ alert: "Empty Post" });
      return setTimeout(() => {
        this.setState({ alert: "" });
      }, 2000);
    }

    let formData = new FormData();
    formData.append("text", this.state.text);
    formData.append(
      "image",
      this.state.image ? e.target.postFile.files[0] : ""
    );
    this.setState({ image: "", text: "" });
    axios
      .post("http://localhost:5000/post/add", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((new_post) => {
        let new_list = [new_post.data, ...this.state.data];
        this.setState({
          data: new_list,
          key: this.state.key + 1,
        });
      })
      .catch((err) => {
        console.log(err);

        this.setState({ alert: "Error Occured" });
        return setTimeout(() => {
          this.setState({ alert: "" });
        }, 2000);
      });
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value, alert: false });
    // this.setState({ image: URL.createObjectURL(e.target.files[0]) });
  };

  handleUploadChange = (e) => {
    if (document.querySelector("#postFile").value)
      this.setState({
        image: URL.createObjectURL(e.target.files[0]),
        alert: false,
      });
    else this.setState({ image: "" });
  };

  closePreview = (e) => {
    const file = document.querySelector("#postFile");
    file.value = file.defaultValue;
    this.setState({
      image: "",
    });
  };

  handleEnter = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      document.querySelector(`#text`).style.height = `5rem`;
      e.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
      e.preventDefault();
    } else {
      let textArea = document.querySelector(`#text`);
      if (textArea.value === "" && e.which === 8)
        textArea.style.height = `5rem`;
      else {
        textArea.style.height = `auto`;
        textArea.style.height = `${textArea.scrollHeight + 30}px`;
      }
    }
  };

  render() {
    return (
      <Container>
        <PostBoxContainer>
          {" "}
          {this.state.alert && <p>{this.state.alert}</p>}
          <form onSubmit={this.handleSubmit}>
            <PostTextArea
              name="text"
              id="text"
              value={this.state.text}
              onChange={this.handleTextChange}
              onKeyPress={this.handleEnter}
              onKeyDown={this.handleEnter}
              placeholder="Share your thoughts!"
            ></PostTextArea>
            {this.state.image ? (
              <>
                <ClosePreview onClick={this.closePreview}>X</ClosePreview>
                <img
                  src={this.state.image}
                  width="150px"
                  alt="preview"
                  key={`postImagePreview${this.state.key}`}
                />
              </>
            ) : (
              ""
            )}
            <Footer>
              <Label htmlFor="postFile">
                Upload
                <input
                  style={{ display: "none" }}
                  id="postFile"
                  type="file"
                  name="postFile"
                  accept="audio/*,video/*,image/*"
                  onChange={this.handleUploadChange}
                />
              </Label>
              <FooterButton type="submit">Post</FooterButton>
            </Footer>
          </form>
        </PostBoxContainer>

        {this.state.data.map((post, index) => {
          return (
            <Post
              post={post}
              index={index}
              key={`post${this.state.key}${index}`}
              delete={this.delete}
              user={this.state.user}
            />
          );
        })}
      </Container>
    );
  }
}

export default PostBox;
