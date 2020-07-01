import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";
import CommentBox from "./CommentBox";
import axios from "axios";
import { socket, socketId } from "./Home";

const PostContainer = styled.div`
  width: 100%;
  margin: 30px auto;
  border: 1px solid black;
  box-sizing: border-box;
  box-shadow: 10px 10px 20px #333;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const PostedBy = styled.p`
  font-size: 1.2rem;
  font-weight: bolder;
  margin: 10px 0 0 0;
  float: left;
`;

const PostHeader = styled.div`
  &:after {
    content: "";
    clear: both;
    display: block;
  }
`;

const Button = styled.button`
  background-color: #3b5998;
  color: #fff;
  float: right;
  margin: 10px 0 0 10px;
`;

const PostedOn = styled.p`
  color: grey;
  font-size: 0.8rem;
  float: left;
  margin: 15px 0 0 10px;
`;

const PostImage = styled.img`
  width: 100%;
`;

const PostText = styled.p`
  color: #333;
`;

const ReactionBar = styled.div`
  border: 1px solid;
  width: 100%;
  height: 20px;
`;

const Reaction = styled.span`
  box-sizing: border-box;
  cursor: pointer;
  padding: 5px;
  margin: 0 10px 0 10px;
`;

class Post extends Component {
  constructor(props) {
    super(props);

    let reactOwner = false;
    for (let i = 0; i < props.post.reactors.length; i++) {
      if (props.post.reactors[i].reactor === props.user) {
        reactOwner = props.post.reactors[i];
        break;
      }
    }

    this.state = {
      user: props.user,
      id: props.post._id,
      name: props.post.user.name,
      postOwner: props.post.user._id,
      text: props.post.text,
      link: props.post.imageLink,
      created: props.post.createdAt,
      upvotes: props.post.totalUpvotes,
      downvotes: props.post.totalDownvotes,
      hearts: props.post.totalHearts,
      index: props.index,
      edit: false,
      editedText: props.post.text,
      allowed: !reactOwner,
      reaction: !reactOwner ? "" : reactOwner.reaction,
    };

    console.log(this.state.allowed);
    console.log(props.post.reactors);
    console.log(props.user);

    // console.log(
    //   props.post.reactors.forEach((reactor) => {
    //     if (reactor.reactor == props.user) return true;
    //   })
    // );
  }

  componentDidMount() {
    socket.on("reactionChanged", (post) => {
      if (post._id == this.state.id) {
        this.setState({
          upvotes: post.totalUpvotes,
          downvotes: post.totalDownvotes,
          heats: post.totalHearts,
        });
      }
    });
  }

  handleUpvote = async (e) => {
    if (this.state.allowed) {
      let reaction = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/add`,
        {
          userId: this.state.user,
          reaction: "Upvote",
          socketId: socketId,
        }
      );

      console.log(reaction);

      this.setState({
        reaction: "Upvote",
        allowed: false,
        upvotes: reaction.data.totalUpvotes,
      });
    } else if (this.state.reaction == "Upvote") {
      let reaction = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/remove`,
        {
          userId: this.state.user,
          reaction: this.state.reaction,
          socketId: socketId,
        }
      );
      this.setState({
        upvotes: reaction.data.totalUpvotes,
        allowed: true,
        reaction: "",
      });
    } else {
      let reactionRemoved = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/remove`,
        {
          userId: this.state.user,
          reaction: this.state.reaction,
          socketId: socketId,
        }
      );

      let reactionAdded = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/add`,
        {
          userId: this.state.user,
          reaction: "Upvote",
          socketId: socketId,
        }
      );
      this.setState({
        reaction: "Upvote",
        allowed: false,
        upvotes: reactionAdded.data.totalUpvotes,
        downvotes: reactionAdded.data.totalDownvotes,
        hearts: reactionAdded.data.totalHearts,
      });
    }
  };

  handleDownvote = async (e) => {
    if (this.state.allowed) {
      let reaction = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/add`,
        {
          userId: this.state.user,
          reaction: "Downvote",
          socketId: socketId,
        }
      );
      this.setState({
        reaction: "Downvote",
        allowed: false,
        downvotes: reaction.data.totalDownvotes,
      });
    } else if (this.state.reaction == "Downvote") {
      let reaction = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/remove`,
        {
          userId: this.state.user,
          reaction: this.state.reaction,
          socketId: socketId,
        }
      );
      this.setState({
        downvotes: reaction.data.totalDownvotes,
        allowed: true,
        reaction: "",
      });
    } else {
      let reactionRemoved = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/remove`,
        {
          userId: this.state.user,
          reaction: this.state.reaction,
          socketId: socketId,
        }
      );

      let reactionAdded = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/add`,
        {
          userId: this.state.user,
          reaction: "Downvote",
          socketId: socketId,
        }
      );
      this.setState({
        reaction: "Downvote",
        allowed: false,
        upvotes: reactionAdded.data.totalUpvotes,
        downvotes: reactionAdded.data.totalDownvotes,
        hearts: reactionAdded.data.totalHearts,
      });
    }
  };

  handleLove = async (e) => {
    if (this.state.allowed) {
      let reaction = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/add`,
        {
          userId: this.state.user,
          reaction: "Heart",
          socketId: socketId,
        }
      );
      this.setState({
        reaction: "Heart",
        allowed: false,
        hearts: reaction.data.totalHearts,
      });
    } else if (this.state.reaction == "Heart") {
      let reaction = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/remove`,
        {
          userId: this.state.user,
          reaction: this.state.reaction,
          socketId: socketId,
        }
      );
      this.setState({
        hearts: reaction.data.totalHearts,
        allowed: true,
        reaction: "",
      });
    } else {
      let reactionRemoved = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/remove`,
        {
          userId: this.state.user,
          reaction: this.state.reaction,
          socketId: socketId,
        }
      );

      let reactionAdded = await axios.post(
        `http://localhost:5000/post/${this.state.id}/reaction/add`,
        {
          userId: this.state.user,
          reaction: "Heart",
          socketId: socketId,
        }
      );
      this.setState({
        reaction: "Heart",
        allowed: false,
        upvotes: reactionAdded.data.totalUpvotes,
        downvotes: reactionAdded.data.totalDownvotes,
        hearts: reactionAdded.data.totalHearts,
      });
    }
  };

  deletePost = async (e) => {
    let deletedPost = await axios.delete(
      `http://localhost:5000/post/${this.state.id}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
      // { crossdomain: true }
    );
    console.log(deletedPost);

    this.props.delete(this.state.id);
  };

  handleEnter = (e) => {
    let textArea = document.querySelector(`#edit${this.state.id}`);
    if (e.which === 27 || e.keyCode === 27)
      this.setState({ edit: false, editComment: this.state.comment });
    if (
      (e.which === 13 && !e.shiftKey && textArea.value !== "") ||
      (e.keyCode === 13 && !e.shiftKey && textArea.value !== "")
    ) {
      this.editPost(e);
    } else {
      if (textArea.value === "" && e.which === 8) {
        textArea.style.height = `5rem`;
      } else {
        textArea.style.height = `auto`;
        textArea.style.height = `${textArea.scrollHeight + 30}px`;
      }
    }
  };

  handlePostChange = (e) => {
    this.setState({ editedText: e.target.value });
  };

  editStateTrue = () => {
    this.setState({ edit: true });
  };

  editPost = async (e) => {
    await axios.put(
      `http://localhost:5000/post/${this.state.id}`,
      { text: this.state.editedText },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    this.setState({ edit: false, text: this.state.editedText });
  };

  render() {
    return (
      <PostContainer key={this.state.id}>
        <PostHeader>
          <PostedBy>{this.state.name}</PostedBy>
          <PostedOn>{moment(this.state.created).fromNow()}</PostedOn>
          {this.state.user == this.state.postOwner ? (
            <>
              <Button onClick={this.deletePost}>Delete Post</Button>
              <Button onClick={this.editStateTrue}>Edit Post</Button>
            </>
          ) : (
            ""
          )}
        </PostHeader>

        {!this.state.edit ? (
          <>
            {" "}
            {this.state.text && (
              <PostText key={`text${this.state.index}`}>
                {this.state.text}
              </PostText>
            )}
          </>
        ) : (
          <textarea
            type="text"
            id={`edit${this.state.id}`}
            onChange={this.handlePostChange}
            onKeyPress={this.handleEnter}
            onKeyUp={this.handleEnter}
            style={{
              width: 100 + "%",
              margin: "10px auto",
              boxSizing: "border-box",
              height: 5 + "rem",
              resize: "none",
            }}
            rows="5"
            placeholder="Edit Your Post"
            value={this.state.editedText}
          />
        )}

        {this.state.link && (
          <PostImage key={`image${this.state.index}`} src={this.state.link} />
        )}
        <ReactionBar>
          {/* // eslint-disable-next-line           */}
          <Reaction
            role="img"
            aria-label="thumbsup"
            onClick={this.handleUpvote}
          >
            👍
          </Reaction>
          {/* // eslint-disable-next-line  */}

          <span>{this.state.upvotes}</span>
          <Reaction
            role="img"
            aria-label="thumbsdown"
            onClick={this.handleDownvote}
          >
            👎
          </Reaction>

          {/* // eslint-disable-next-line  */}

          <span>{this.state.downvotes}</span>
          <Reaction
            role="img"
            aria-label="thumbsdown"
            onClick={this.handleLove}
          >
            ❤️
          </Reaction>

          {/* // eslint-disable-next-line  */}

          <span>{this.state.hearts}</span>
        </ReactionBar>
        <CommentBox
          id={this.state.id}
          key={`comment${this.state.index}`}
          user={this.state.user}
        />
      </PostContainer>
    );
  }
}

export default Post;
