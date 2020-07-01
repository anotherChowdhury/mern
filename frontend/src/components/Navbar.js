import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Menubar = styled.nav`
  width: 90%;
  margin: auto;
  height: 20%;
  border: 1px solid;
`;

const List = styled.ul`
  & {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  &:after {
    content: "";
    clear: both;
    display: block;
  }
`;

const ListItem = styled.li`
  float: left;
  width: 20%;
  padding: 20px;
  border: 1px solid black;
  text-align: center;
`;

export default function Navbar(props) {
  return (
    <Menubar>
      <List>
        <ListItem>
          <Link to="/signup"> Register</Link>
        </ListItem>
        <ListItem>
          {" "}
          <Link to="/signin">Login</Link>{" "}
        </ListItem>
      </List>
    </Menubar>
  );
}
