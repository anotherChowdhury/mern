import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import Comment from "./Comment";
import { socket, socketId } from "./Home";

const CommentBoxContainer = styled.div`
  border: 1px solid;
  z-index: 2;
`;

const CommentTextArea = styled.textarea`
  width: 100%;
  display: block;
  box-sizing: border-box;
  resize: none;
  margin: 5px 0 0 0;
  overflow: hidden;
  position: relative;
`;

const CommentForm = styled.form`
  box-sizing: border-box;
`;
const CommentFooter = styled.div`
  & {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
  }
`;

const CommentFooterButton = styled.button`
  & {
    background-color: #3b5998;
    color: #fff;
    padding: 3px;
    margin: "0 0 20px 20px";
    border: none;
    font-size: 1rem;
  }
  &:hover {
    background-color: #323;
  }
`;

const CommentLabel = styled.label`
  & {
    background-color: #3b5998;
    color: #fff;
    padding: 3px;
    font-size: 1rem;
    margin: "0 20px 20px 0";
  }
  &:hover {
    background-color: #323;
  }
`;

const CloseCommentPreview = styled.button`
  margin: none;
  border: none;
  position: absolute;
`;

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      commentImage: "",
      alert: false,
      data: [],
      postId: props.id,
      key: 1,
      user: props.user,
    };

    this.delete = this.delete.bind(this);
  }

  delete(commentId) {
    let new_state = this.state.data.filter(
      (comment) => comment._id !== commentId
    );
    this.setState({ data: new_state, key: this.state.key + 1 });
  }

  async componentDidMount() {
    let comments = await axios.get(`post/${this.state.postId}/comment/`);
    this.setState({ data: comments.data });

    socket.on("newComment", (data) => {
      console.log(data);

      if (data.post == this.state.postId)
        this.setState({ data: [...this.state.data, data] });
    });

    socket.on("deletedComment", (data) => {
      console.log(data);

      if (data.pid == this.state.postId) {
        this.delete(data.cid);
      }
    });
  }

  handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (this.state.text === "" && this.state.commentImage === "") {
      this.setState({ alert: "Empty Post" });
      return setTimeout(() => {
        this.setState({ alert: "" });
      }, 2000);
    }
    console.log(socketId);

    let formData = new FormData();
    formData.append("text", this.state.text);
    formData.append(
      "commentImage",
      this.state.commentImage ? e.target.commentfile.files[0] : ""
    );
    formData.append("socketId", socketId);
    this.setState({ commentImage: "", text: "" });
    let new_comment = await axios.post(
      `http://localhost:5000/post/${this.state.postId}/comment/add`,
      formData,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    this.setState({
      data: [...this.state.data, new_comment.data.comment],
      key: this.state.key + 1,
    });
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value, alert: false });
    // this.setState({ commentImage: URL.createObjectURL(e.target.files[0]) });
  };

  handleCommentUploadChange = (e) => {
    if (document.querySelector(`#commentFile${this.state.postId}`).value) {
      this.setState({
        commentImage: URL.createObjectURL(e.target.files[0]),
        alert: false,
      });
    } else {
      console.log("In else");
      this.setState({ commentImage: "" });
    }
  };

  closeCommentPreview = (e) => {
    const file = document.querySelector(`#commentFile${this.state.postId}`);
    file.value = file.defaultValue;
    this.setState({
      commentImage: "",
    });
  };

  handleEnter = (e) => {
    // e.preventDefault();
    if (e.which === 13 && !e.shiftKey) {
      document.querySelector(`#commentText${this.state.postId}`).style.height =
        "3rem";
      e.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
      e.preventDefault();
      // textArea.style.height = `3rem`;
      // e.target.form.dispatchEvent(new Event("submit"));
      // e.preventDefault();
    } else {
      let textArea = document.querySelector(`#commentText${this.state.postId}`);
      if (textArea.value === "" && e.which === 8) {
        textArea.style.height = `3rem`;
      } else {
        textArea.style.height = `auto`;
        textArea.style.height = `${textArea.scrollHeight + 20}px`;
      }
    }
  };

  render() {
    return (
      <>
        {this.state.data.map((comment, index) => (
          <Comment
            comment={comment}
            index={index}
            delete={this.delete}
            key={`comment${index}${this.state.key}`}
            user={this.state.user}
          />
        ))}

        {this.state.alert && <p>{this.state.alert}</p>}

        <CommentForm onSubmit={this.handleCommentSubmit}>
          <CommentTextArea
            name="text"
            id={`commentText${this.state.postId}`}
            rows="3"
            value={this.state.text}
            onChange={this.handleTextChange}
            onKeyPress={this.handleEnter}
            onKeyDown={this.handleEnter}
            placeholder="Share your thoughts on this maybe?"
          ></CommentTextArea>
          {this.state.commentImage ? (
            <>
              <CloseCommentPreview onClick={this.closeCommentPreview}>
                X
              </CloseCommentPreview>
              <img src={this.state.commentImage} width="150px" alt="ajaira" />
            </>
          ) : (
            ""
          )}
          <CommentFooter>
            <CommentLabel htmlFor={`commentFile${this.state.postId}`}>
              Upload
              <input
                style={{ display: "none" }}
                id={`commentFile${this.state.postId}`}
                type="file"
                name="commentfile"
                accept="audio/*,video/*,Image/*"
                onChange={this.handleCommentUploadChange}
              />
            </CommentLabel>
            <CommentFooterButton type="submit">Post</CommentFooterButton>
          </CommentFooter>
        </CommentForm>
      </>
    );
  }
}

export default CommentBox;
