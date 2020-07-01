import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";
import axios from "axios";
import { socket, socketId } from "./Home";

const CommentContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 10px 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const CommentHeader = styled.div`
   {
    box-sizing: border-box;
    width: 100%;
  }
  &:after {
    content: "";
    clear: both;
    display: block;
  }
`;

const CommentPoster = styled.span`
  margin-left: 10px;
  font-size: 0.9rem;
`;

const CommentedOn = styled.span`
  font-size: 0.6rem;
  colro: grey;
  margin: 0 10px 0 10px;
`;

const CommentImage = styled.img`
    width:80%
    margin:10px auto;
`;

const Button = styled.button`
  background-color: #3b5998;
  color: #fff;
  float: right;
  margin: 0 auto;
`;

const CommentText = styled.p`
  margin: 0 10px;
`;

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      commentOwner: props.comment.user._id,
      id: props.comment._id,
      name: props.comment.user.name,
      comment: props.comment.comment,
      link: props.comment.imageLink,
      created: props.comment.createdAt,
      index: props.index,
      edit: false,
      editedComment: props.comment.comment,
    };
  }

  componentDidMount() {
    socket.on("updatedComment", (comment) => {
      console.log(comment);

      if (this.state.id == comment._id) {
        this.setState({ comment: comment.comment });
      }
    });
  }

  deleteComment = async (e) => {
    let result = await axios.delete(
      `http://localhost:5000/post/123/comment/${this.state.id}`,
      { data: { socketId } }
    );
    console.log(result);

    this.props.delete(this.state.id);
  };

  handleEnter = (e) => {
    if (e.which === 27 || e.keyCode === 27)
      this.setState({ edit: false, editComment: this.state.comment });
    if ((e.which === 13 && !e.shiftKey) || (e.keyCode === 13 && !e.shiftKey)) {
      this.editComment(e);
    } else {
      let textArea = document.querySelector(`#edit${this.state.id}`);
      if (textArea.value === "" && e.which === 8) {
        textArea.style.height = `3rem`;
      } else {
        textArea.style.height = `auto`;
        textArea.style.height = `${textArea.scrollHeight + 30}px`;
      }
    }
  };

  handleCommentChange = (e) => {
    this.setState({ editedComment: e.target.value });
  };

  editStateTrue = () => {
    this.setState({ edit: true });
  };

  editComment = async (e) => {
    await axios.put(`http://localhost:5000/post/123/comment/${this.state.id}`, {
      updatedComment: this.state.editedComment,
      socketId: socketId,
    });
    this.setState({ edit: false, comment: this.state.editedComment });
  };

  render() {
    return (
      <CommentContainer>
        <CommentHeader>
          <CommentPoster>{this.state.name}</CommentPoster>
          <CommentedOn>{moment(this.state.created).fromNow()}</CommentedOn>
          {this.state.user == this.state.commentOwner ? (
            <>
              {" "}
              <Button onClick={this.deleteComment}>Delete Comment</Button>
              <Button onClick={this.editStateTrue}>Edit Comment</Button>
            </>
          ) : (
            ""
          )}
        </CommentHeader>

        {!this.state.edit ? (
          <>
            {" "}
            {this.state.comment && (
              <CommentText>{this.state.comment}</CommentText>
            )}{" "}
          </>
        ) : (
          <textarea
            type="text"
            id={`edit${this.state.id}`}
            onChange={this.handleCommentChange}
            onKeyPress={this.handleEnter}
            onKeyUp={this.handleEnter}
            onSubmit={this.editComment}
            style={{
              width: 100 + "%",
              margin: "10px auto",
              boxSizing: "border-box",
              resize: "none",
              overflow: "hidden",
              height: 3 + "rem",
            }}
            rows="3"
            placeholder="Edit Your Comment"
            value={this.state.editedComment}
          />
        )}
        {this.state.link && <CommentImage src={this.state.link} width="80%" />}
      </CommentContainer>
    );
  }
}

export default Comment;
