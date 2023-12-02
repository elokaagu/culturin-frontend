import React from "react";
import styled from "styled-components";

export default function Header() {
  return (
    <Head>
      <HeaderLeft>
        <h1>Culturin</h1>
      </HeaderLeft>
      <HeaderRight>
        <ul>
          <li>Countries</li>
          <li>Read</li>
          <li>Watch</li>
          <li>Events</li>
          <li>Sign In</li>
        </ul>
      </HeaderRight>
    </Head>
  );
}

const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  background: black;
  padding: 20px;
  flex: 1;

  h1 {
    font-weight: 600;
    font-size: 30px;
    color: white;

    cursor: pointer;
  }

  h2 {
    font-weight: 400;
    color: white;
    font-size: 1rem;
  }

  li {
    list-style: none;
    display: inline-block;
    color: #ccc;
    padding: 20px;
    cursor: pointer;
  }

  ul {
    list-style: none;
    display: inline-block;
    color: #ccc;
  }
`;

const HeaderLeft = styled.div``;

const HeaderRight = styled.div``;
